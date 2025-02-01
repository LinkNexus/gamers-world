<?php

namespace App\DTO;

use Symfony\Component\Mime\Address;

class TemplatedMailDTO
{

    /**
     * TemplatedMailDTO constructor.
     * @param string $subject
     * @param string $template
     * @param array $context
     * @param string[]|Address[] $fromAddresses
     * @param string[]|Address[] $toAddresses
     */
    public function __construct(
        string $subject,
        string $template,
        array $context = [],
        array $fromAddresses = [],
        array $toAddresses = [],
    )
    {
        $this->subject = $subject;
        $this->template = $template;
        $this->context = $context;
        $this->fromAddresses = $fromAddresses;
        $this->toAddresses = $toAddresses;
    }

    private string $subject;
    private string $template;
    private array $context;

    /**
     * @var string[]|Address[]
     */
    private array $fromAddresses;

    /**
     * @var string[]|Address[]
     */
    private array $toAddresses;

    /**
     * @return string
     */
    public function getSubject(): string
    {
        return $this->subject;
    }

    /**
     * @param string $subject
     * @return static
     */
    public function setSubject(string $subject): static
    {
        $this->subject = $subject;
        return $this;
    }

    /**
     * @return array
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * @param array $context
     * @return static
     */
    public function setContext(array $context): static
    {
        $this->context = $context;
        return $this;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return $this->template;
    }

    /**
     * @param string $template
     * @return static
     */
    public function setTemplate(string $template): static
    {
        $this->template = $template;
        return $this;
    }

    /**
     * @return array
     */
    public function getFromAddresses(): array
    {
        return $this->fromAddresses;
    }

    /**
     * @param array $fromAddresses
     * @return static
     */
    public function setFromAddresses(string|Address ...$fromAddresses): static
    {
        $this->fromAddresses = $fromAddresses;
        return $this;
    }

    /**
     * @return array
     */
    public function getToAddresses(): array
    {
        return $this->toAddresses;
    }

    /**
     * @param array $toAddresses
     * @return static
     */
    public function setToAddresses(string|Address ...$toAddresses): static
    {
        $this->toAddresses = $toAddresses;
        return $this;
    }
}