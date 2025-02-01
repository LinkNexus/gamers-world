<?php

namespace App\Entity;

use App\Config\Gender;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
#[UniqueEntity(fields: ['username'], message: 'There is already an account with this username')]
#[UniqueEntity(fields: ['identifier'], message: 'There is already an account with this id')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\Email(message: 'Please, enter a valid email address')]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]

    #[Assert\Sequentially(
        constraints: [
            new Assert\Length(min: 5, max: 255, minMessage: 'Your username must be at least {{ limit }} characters long', maxMessage: 'Your username cannot be longer than {{ limit }} characters'),
            new Assert\Regex(pattern: '/[0-9a-zA-Z_]*/', message: 'The username must only contain letters, numbers and underscores'),
            new Assert\Regex(pattern: '/^@/', message: 'The username must start with an @ symbol')
        ]
    )]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Sequentially(
        constraints: [
            new Assert\Length(min: 5, max: 255, minMessage: 'Your name must be at least {{ limit }} characters long', maxMessage: 'Your name cannot be longer than {{ limit }} characters'),
            new Assert\Regex(pattern: '/^[a-zA-Z]/', message: 'The username must start with a letter'),
            new Assert\Regex(pattern: '/[0-9a-zA-Z_]*/', message: 'The username must only contain letters, numbers and underscores'),
            new Assert\Regex(pattern: '/[0-9a-zA-Z]$/', message: 'The username must end with a letter or number')
        ]
    )]
    private ?string $name = null;

    #[ORM\Column(type: 'ulid')]
    private ?Ulid $identifier = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column]
    private bool $isVerified = false;

    #[ORM\Column(nullable: true, enumType: Gender::class)]
    private ?Gender $gender = null;

    public function __construct()
    {
        $this->identifier = new Ulid();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getIdentifier(): ?Ulid
    {
        return $this->identifier;
    }

    public function setIdentifier(Ulid $identifier): static
    {
        $this->identifier = $identifier;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function deleteImage(string $baseDirectory): static
    {
        if ($this->getImage() && $this->getImage() !== 'default-image.jpg') {
            unlink($baseDirectory . '/public/images/users/' . $this->getImage());
        }

        $this->image = null;
        return $this;
    }

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function isPublic(): bool
    {
        return true;
    }
}
