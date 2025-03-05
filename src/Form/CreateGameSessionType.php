<?php

namespace App\Form;

use App\Entity\Game;
use App\Entity\GameSession;
use App\Enum\Game\Difficulty;
use App\Enum\Game\Type;
use App\Enum\GameName;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfonycasts\DynamicForms\DependentField;
use Symfonycasts\DynamicForms\DynamicFormBuilder;

class CreateGameSessionType extends AbstractType
{

    static array $gameTypes = [
        Type::SOLO->value => [
            'memory-game'
        ],
        Type::COMPUTER->value => [
            'tic-tac-toe',
            'chifoumi',
            'memory-game'
        ],
        Type::FRIEND->value => [
            'tic-tac-toe',
            'chifoumi',
            'memory-game'
        ],
        Type::OPPONENT->value => [
            'tic-tac-toe',
            'chifoumi',
            'memory-game'
        ]
    ];

    public function __construct(private readonly Security $security)
    {}

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder = new DynamicFormBuilder($builder);

        $builder
            ->add('game', EntityType::class, [
                'class' => Game::class,
                'choice_label' => 'name',
                'label' => false
            ])
            ->addDependent(
                'type',
                'game',
                function (DependentField $field, ?Game $game) {
                    $types = [];

                    if ($game === null) {
                        return;
                    }

                    foreach (self::$gameTypes as $type => $games) {
                        if (in_array($game->getSlug(), $games)) {
                            $types[] = Type::fromString($type);
                        }
                    }

                    $field->add(EnumType::class, [
                        'class' => Type::class,
                        'label' => 'Choose your play mode:',
                        'choices' => $types,
                        'expanded' => true,
                        'multiple' => false,
                        'choice_filter' => function (?Type $type) {
                            if (
                                !$this->security->isGranted('ROLE_USER') &&
                                $type &&
                                ($type->value === Type::OPPONENT->value || $type->value === Type::FRIEND->value)
                            ) {
                                return false;
                            }

                            return true;
                        },
                        "choice_label" => function (Type $type) {
                        $description = $type->getDescription();
                        $name = ucfirst($type->value);

                            return <<<HTML
<div class="block">
    <div class="w-full text-lg font-semibold text-white">$name</div>
    <div class="w-full">$description</div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12h16m0 0l-6-6m6 6l-6 6"/></svg>
HTML;
                            },
                        "label_html" => true,
                        'choice_attr' => function () {
                            return [
                                'data-disable-button-target' => 'toBeChecked',
                            ];
                        },
                        'attr' => [
                            'class' => "space-y-4 mb-4"
                        ],
                        'label_attr' => [
                            'class' => 'mb-4'
                        ],
                        'error_bubbling' => true
                    ]);
                }
                )
            ->addDependent(
                'duration',
                'type',
                function (DependentField $field, ?Type $type) {
                    if ($type === null || (
                        $type->value === Type::SOLO->value ||
                        $type->value === Type::COMPUTER->value
                        )
                    ) {
                        return;
                    }

                    return $field->add(ChoiceType::class, [
                        'choices' => [
                            '10 Seconds' => 10,
                            '20 Seconds' => 20,
                            '30 Seconds' => 30,
                        ],
                        'expanded' => true,
                        'multiple' => false,
                        'attr' => [
                            'class' => "space-y-4 mb-4"
                        ],
                        "label_html" => true,
                        "choice_label" => function (int $duration) {
                            return <<<HTML
<div class="block">
    <div class="w-full text-lg font-semibold text-white">$duration Seconds</div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12h16m0 0l-6-6m6 6l-6 6"/></svg>
HTML;
                        },
                        'label_attr' => [
                            'class' => 'mb-4'
                        ],
                        'label' => 'Choose the duration of each turn:',
                        'error_bubbling' => true,
                        'choice_attr' => function () {
                            return [
                                'data-disable-button-target' => 'toBeChecked',
                            ];
                        },
                    ]);
                }
            )
            ->addDependent(
                'difficulty',
                'type',
                function (DependentField $field, ?Type $type) {
                    if (
                        $type === null ||
                        $type->value !== Type::SOLO->value &&
                        $type->value !== Type::COMPUTER->value
                    ) {
                        return;
                    }

                    return $field->add(EnumType::class, [
                        'class' => Difficulty::class,
                        'expanded' => true,
                        'multiple' => false,
                        'attr' => [
                            'class' => "space-y-4 mb-4"
                        ],
                        "label_html" => true,
                        "choice_label" => function (Difficulty $difficulty) {
                        $name = ucfirst(strtolower($difficulty->name));
                            return <<<HTML
<div class="block">
    <div class="w-full text-lg font-semibold text-white">$name</div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12h16m0 0l-6-6m6 6l-6 6"/></svg>
HTML;
                        },
                        'label_attr' => [
                            'class' => 'mb-4'
                        ],
                        'label' => 'Choose your difficulty:',
                        'error_bubbling' => true,
                        'choice_attr' => function () {
                            return [
                                'data-disable-button-target' => 'toBeChecked',
                            ];
                        },
                    ]);
                }
            )
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
            'data_class' => GameSession::class
        ]);
    }
}
