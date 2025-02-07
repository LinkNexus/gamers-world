<?php

namespace App\Twig\Runtime;

use Twig\Extension\RuntimeExtensionInterface;

class JsonSerializeExtensionRuntime implements RuntimeExtensionInterface
{
    public function __construct()
    {
        // Inject dependencies if needed
    }

    public function serialize(string $value): string
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
    }
}
