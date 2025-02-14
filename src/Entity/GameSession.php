<?php

namespace App\Entity;

use App\Enum\Game\Type;
use App\Enum\Game\Difficulty;
use App\Repository\GameSessionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: GameSessionRepository::class)]
class GameSession
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $initiator = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    private Collection $opponents;

    #[ORM\ManyToOne]
    private ?User $winner = null;

    #[ORM\Column]
    private ?bool $isCompleted = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Game $game = null;

    #[ORM\Column(enumType: Type::class)]
    private ?Type $type = null;

    #[ORM\Column(nullable: true)]
    private ?int $duration = null;

    #[ORM\Column(nullable: true, enumType: Difficulty::class)]
    private ?Difficulty $difficulty = null;

    #[ORM\Column(type: 'uuid')]
    private ?Uuid $identifier = null;

    public function __construct()
    {
        $this->setIdentifier(Uuid::v4());
        $this->opponents = new ArrayCollection();
        $this->setIsCompleted(false);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInitiator(): ?User
    {
        return $this->initiator;
    }

    public function setInitiator(?User $initiator): static
    {
        $this->initiator = $initiator;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getOpponents(): Collection
    {
        return $this->opponents;
    }

    public function addOpponent(User $opponent): static
    {
        if (!$this->opponents->contains($opponent)) {
            $this->opponents->add($opponent);
        }

        return $this;
    }

    public function removeOpponent(User $opponent): static
    {
        $this->opponents->removeElement($opponent);

        return $this;
    }

    public function getWinner(): ?User
    {
        return $this->winner;
    }

    public function setWinner(?User $winner): static
    {
        $this->winner = $winner;

        return $this;
    }

    public function isCompleted(): ?bool
    {
        return $this->isCompleted;
    }

    public function setIsCompleted(bool $isCompleted): static
    {
        $this->isCompleted = $isCompleted;

        return $this;
    }

    public function getGame(): ?Game
    {
        return $this->game;
    }

    public function setGame(?Game $game): static
    {
        $this->game = $game;

        return $this;
    }

    public function getType(): ?Type
    {
        return $this->type;
    }

    public function setType(Type $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDifficulty(): ?Difficulty
    {
        return $this->difficulty;
    }

    public function setDifficulty(?Difficulty $difficulty): static
    {
        $this->difficulty = $difficulty;

        return $this;
    }

    public function getIdentifier(): ?Uuid
    {
        return $this->identifier;
    }

    public function setIdentifier(Uuid $identifier): static
    {
        $this->identifier = $identifier;

        return $this;
    }
}
