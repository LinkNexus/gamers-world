<?php

namespace App\Form\User;

use App\Entity\User;
use App\Enum\Gender;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotCompromisedPassword;
use Symfony\Component\Validator\Constraints\PasswordStrength;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('plainPassword', RepeatedType::class, [
                // instead of being set onto the object directly,
                // this is read and encoded in the controller
                'type' => PasswordType::class,
                'required' => false,
                'mapped' => false,
                'attr' => ['autocomplete' => 'new-password'],
                'first_options' => [
                    'label' => 'Password',
                    'always_empty' => false,
                    'attr' => ['placeholder' => 'Password'],
                    'toggle' => true,
                    'constraints' => [
                        new Length([
                            'min' => 12,
                            'minMessage' => 'Your password should be at least {{ limit }} characters',
                            // max length allowed by Symfony for security reasons
                            'max' => 4096,
                        ]),
                        new NotCompromisedPassword(),
                        new PasswordStrength()
                    ]
                ],
                'second_options' => [
                    'label' => 'Repeat Password',
                    'always_empty' => false,
                    'attr' => ['placeholder' => 'Repeat Password'],
                    'toggle' => true
                ],
            ])
            ->add('username', TextType::class, [
                'attr' => [
                    'placeholder' => 'Username',
                ],
            ])
            ->add('name', TextType::class, [
                'attr' => [
                    'placeholder' => 'Name'
                ],
            ])
            ->add('gender', EnumType::class, [
                'class' => Gender::class,
                'placeholder' => 'Choose a gender (Optional)'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
