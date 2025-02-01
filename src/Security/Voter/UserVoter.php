<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\CacheableVoterInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserVoter extends Voter implements CacheableVoterInterface
{
    public const string VIEW = 'USER_VIEW';
    public const string IS_VERIFIED = 'IS_VERIFIED';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::VIEW, self::IS_VERIFIED])
            && ($subject instanceof User || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // if the user is anonymous, do not grant access
        if (!($user instanceof User)) {
            return false;
        }

        /**
         * @var User $subject
         * @var User $user
         */

        // ... (check conditions and return true to grant permission) ...
        return match ($attribute) {
            self::VIEW => $subject && $subject->isPublic(),
            self::IS_VERIFIED => $user->isVerified(),
            default => false,
        };

    }
}
