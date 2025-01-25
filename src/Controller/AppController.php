<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Asset\Packages;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\UX\Cropperjs\Factory\CropperInterface;
use Symfony\UX\Cropperjs\Form\CropperType;
use Symfony\UX\Dropzone\Form\DropzoneType;

final class AppController extends AbstractController
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {}

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('app/index.html.twig');
    }

    #[Route('/profile/{id}', name: 'app_profile')]
    public function profile(
        Request $request,
        FileUploader $fileUploader,
        CropperInterface $cropper,
        Packages $assets,
        ?int $id = null
    ): Response
    {
        $user = $id ? $this->entityManager->getRepository(User::class)->findOneBy([
            'identifier' => $id,
        ]) : $this->getUser();

        if (!$user) {
            throw $this->createNotFoundException('User not found');
        }

        $form = $this->createForm(UserType::class, $user);
        $profileImageForm = $this->createFormBuilder()
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

        $crop = $cropper->createCrop($this->getParameter('kernel.project_dir') . '/public/images/users/' . $user->getImage());
        $cropForm = $this->createFormBuilder(['crop' => $crop])
            ->add('crop', CropperType::class, [
                'public_url' => $assets->getUrl('images/users/' . $user->getImage()),
                'cropper_options' => [
                    'preview' => '#cropper-preview',
                ],
                'error_bubbling' => true,
                'empty_data' => '',
            ])->getForm();

        $form->handleRequest($request);
        $profileImageForm->handleRequest($request);
        $cropForm->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            dd($form->getData());
        }

        if ($profileImageForm->isSubmitted()) {
            if ($profileImageForm->isValid()) {

                $file = $profileImageForm->get('image')->getData();
                if ($user->getImage() && $user->getImage() !== 'default-image.jpg') {
                    unlink($this->getParameter('kernel.project_dir') . '/public/images/users/' . $user->getImage());
                }

                try {
                    $fileName = $fileUploader->upload($file, '/images/users/');
                    $user->setImage($fileName);
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

        if ($cropForm->isSubmitted()) {
            if ($cropForm->isValid()) {
                dd($cropForm->getData());
            } else {
                $this->addFlash('error', $cropForm->getErrors());
            }
        }

        return $this->render('app/profile.html.twig', [
            'user' => $user,
            'form' => $form,
            'profileImageForm' => $profileImageForm,
            'cropForm' => $cropForm,
        ]);
    }
}
