<?php

namespace App\EventSubscriber;

use App\Events\TemplatedMailRequestEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

final readonly class MailRequestSubscriber implements EventSubscriberInterface
{

    public function __construct(
        private MailerInterface $mailer,
        private RequestStack $requestStack,
    )
    {}

    public function onTemplatedMailRequestEvent(TemplatedMailRequestEvent $event): void
    {
        $mailDetails = $event->getMailDetails();

        try {
            $this->mailer->send(
                (new TemplatedEmail())
                    ->from(...$mailDetails->getFromAddresses())
                    ->to(...$mailDetails->getToAddresses())
                    ->subject($mailDetails->getSubject())
                    ->htmlTemplate($mailDetails->getTemplate())
                    ->context($mailDetails->getContext())
            );
        } catch (TransportExceptionInterface $exception) {
            $this->requestStack->getSession()->getFlashBag()->add('error', 'An error occurred while sending the email');
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            TemplatedMailRequestEvent::class => 'onTemplatedMailRequestEvent',
        ];
    }
}
