<?php

namespace App\Events;

use App\DTO\TemplatedMailDTO;
use Symfony\Contracts\EventDispatcher\Event;

class TemplatedMailRequestEvent extends Event
{
    public function __construct(private readonly TemplatedMailDTO $templatedMailDTO)
    {}

    public function getMailDetails(): TemplatedMailDTO
    {
        return $this->templatedMailDTO;
    }
}