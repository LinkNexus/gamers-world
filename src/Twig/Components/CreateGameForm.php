<?php

namespace App\Twig\Components;

use App\Entity\GameSession;
use App\Form\CreateGameSessionType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\ComponentWithFormTrait;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class CreateGameForm extends AbstractController
{
    use DefaultActionTrait;
    use ComponentWithFormTrait;

    /**
     * @return FormInterface
     */
    protected function instantiateForm(): FormInterface
    {
        return $this->createForm(CreateGameSessionType::class);
    }
}
