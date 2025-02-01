<?php

namespace App\Security\Profile;

use App\DTO\TemplatedMailDTO;
use App\Entity\User;
use App\Events\TemplatedMailRequestEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\UrlHelper;
use Symfony\Component\Routing\Generator\UrlGenerator;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;

readonly class EmailVerifier
{

    public function __construct(
        private readonly VerifyEmailHelperInterface $verifyEmailHelper,
        private readonly EventDispatcherInterface $dispatcher,
        private readonly EntityManagerInterface $entityManager
    )
    {}

    public function sendEmailConfirmation(string $verifyEmailRouteName, User $user, TemplatedMailDTO $mailDetails): void
    {
        $signatureComponents = $this->verifyEmailHelper->generateSignature(
            $verifyEmailRouteName,
            (string) $user->getId(),
            (string) $user->getEmail()
        );

        $context = $mailDetails->getContext();
        $context['signedUrl'] = $signatureComponents->getSignedUrl();
        $context['expiresAtMessageKey'] = $signatureComponents->getExpirationMessageKey();
        $context['expiresAtMessageData'] = $signatureComponents->getExpirationMessageData();

        $mailDetails->setContext($context);

        $this->dispatcher->dispatch(new TemplatedMailRequestEvent($mailDetails));
    }

    public function handleEmailConfirmation(Request $request, User $user): void
    {
        $this->verifyEmailHelper->validateEmailConfirmationFromRequest($request, (string) $user->getId(), (string) $user->getEmail());

        $user->setEmail($request->getSession()->get('newEmail'));
        $this->entityManager->flush();
        $request->getSession()->remove('newEmail');
        $request->getSession()->getFlashBag()->add('success', 'Your email address has been successfully changed.');
    }
}