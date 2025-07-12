<?php

namespace App\Controller;

use App\Entity\Game;
use App\Security\Registration\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class AppController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
    }

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        $games = $this->entityManager->getRepository(Game::class)->findAll();
        return $this->render('app/index.html.twig', [
            'games' => $games,
        ]);
    }

    #[IsGranted("IS_AUTHENTICATED", message: "You must be logged in to access this page")]
    #[Route('/resend-verification-email', name: 'app_resend_verification_email')]
    public function resendVerificationEmail(EmailVerifier $emailVerifier, #[CurrentUser] $user): RedirectResponse
    {
        if (!$user->isVerified()) {
            $emailVerifier->sendEmailConfirmation('app_verify_email', $user,
                (new TemplatedEmail())
                    ->from(new Address('contact@levynkeneng.dev', 'Contact - GamersWorld'))
                    ->to((string)$user->getEmail())
                    ->subject('Please Confirm your Email')
                    ->htmlTemplate('auth/registration/confirmation_email.html.twig')
            );
            $this->addFlash('success', "The verification email has been resent. Please check your mailbox.");
        }

        return $this->redirectToRoute('app_profile');
    }
}
