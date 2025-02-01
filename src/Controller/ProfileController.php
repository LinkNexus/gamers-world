<?php

namespace App\Controller;

use App\DTO\TemplatedMailDTO;
use App\Entity\User;
use App\Form\User\ChangeEmailType;
use App\Form\User\UserType;
use App\Security\Profile\EmailVerifier;
use App\Service\FileUploader;
use App\Service\ProfileImageGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\UX\Dropzone\Form\DropzoneType;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly EmailVerifier $emailVerifier,
    )
    {}

    #[Route('/', name: '')]
    public function index(
        Request $request,
        FileUploader $fileUploader,
        FormFactoryInterface $formFactory,
    ): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $form = $this->createForm(UserType::class, $user);
        $profileImageForm = $formFactory->createNamedBuilder('profile_image')
            ->add('image', DropzoneType::class, [
                'error_bubbling' => true,
                'required' => true,
                'constraints' => [
                    new Image([
                        'maxSize' => '2M',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                            'image/jpg',
                            'image/svg'
                        ],
                        'mimeTypesMessage' => 'Please upload a valid image',
                    ]),
                ]
            ])->getForm();
        $changeEmailForm = $this->createForm(ChangeEmailType::class);


        $form->handleRequest($request);
        $profileImageForm->handleRequest($request);
        $changeEmailForm->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->denyAccessUnlessGranted('IS_VERIFIED', $user, 'You must be verified to edit your Account');
            $this->entityManager->flush();
            $this->addFlash('success', 'Profile updated successfully');
            return $this->redirectToRoute('app_profile');
        }

        if ($profileImageForm->isSubmitted()) {
            if ($profileImageForm->isValid()) {
                $this->denyAccessUnlessGranted('IS_VERIFIED', $user, 'You must be verified to change your profile image');

                $file = $profileImageForm->get('image')->getData();
                $user->deleteImage($this->getParameter('kernel.project_dir'));

                try {
                    $fileName = $fileUploader->upload($file, '/images/users/');
                    $user->setImage($fileName);
                    $user->setUsername("@". $user->getUsername());
                    $this->addFlash('success', 'Image uploaded successfully');
                    $this->entityManager->flush();

                    return $this->redirectToRoute('app_profile');
                } catch (FileException $exception) {
                    $this->addFlash('error', 'An error occurred while uploading the image');
                }

            } else {
                $this->addFlash('error', $profileImageForm->getErrors());
            }
        }

        if ($changeEmailForm->isSubmitted() && $changeEmailForm->isValid()) {
            $this->denyAccessUnlessGranted('IS_VERIFIED', $user, 'You must be verified to change your email');

            $mailDetails = new TemplatedMailDTO(
                subject: 'Please Confirm your Email',
                template: 'app/profile/confirmation_email.html.twig',
                fromAddresses: ['contact@gamersworld.com'],
                toAddresses: [$changeEmailForm->get('email')->getData()],
            );

            $this->emailVerifier->sendEmailConfirmation('app_profile_change_email', $user, $mailDetails);
            $request->getSession()->set('newEmail', $changeEmailForm->get('email')->getData());
            $this->addFlash('success', 'A confirmation email has been sent to your new email address');
            return $this->redirectToRoute('app_profile');
        }

        return $this->render('app/profile/index.html.twig', [
            'user' => $user,
            'form' => $form,
            'profileImageForm' => $profileImageForm,
            'changeEmailForm' => $changeEmailForm,
        ]);
    }

    #[Route('/change-email', name: '_change_email')]
    #[IsGranted('IS_VERIFIED', message: 'You must be verified to change your email')]
    public function changeEmail(
        Request $request,
    ): RedirectResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $this->emailVerifier->handleEmailConfirmation($request, $user);
        return $this->redirectToRoute('app_profile');
    }

    #[Route('/{pseudo}', name: '_view', requirements: ['pseudo' => '^@\S+$'], priority: -1)]
    #[IsGranted('USER_VIEW', subject: 'user', message: 'You cannot view the profile of this user')]
    public function profile(
        #[MapEntity(mapping: [
            'pseudo' => 'username',
        ])]
        ?User $user
    ): Response
    {
        if ($user === $this->getUser()) {
            return $this->redirectToRoute('app_profile');
        }

        return $this->render('app/profile/view.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/image/random', name: '_random_image', methods: ['POST'])]
    #[IsGranted('IS_VERIFIED', message: 'You must be verified to change your profile image')]
    public function generateRandomImage(
        ProfileImageGenerator $imageGenerator,
        #[CurrentUser] ?User $user
    ): RedirectResponse
    {
        $imageName = $imageGenerator->generateImageByGender($user->getGender(), $user->getUsername());

        if ($imageName) {
            $user->deleteImage($this->getParameter('kernel.project_dir'));
            $user->setImage($imageName);
            $this->entityManager->flush();
            $this->addFlash('success', 'Random image generated successfully');
        } else {
            $this->addFlash('error', 'An error occurred while generating the image');
        }

        return $this->redirectToRoute('app_profile');
    }
}
