<?php

namespace App\Twig\Runtime;

use Twig\Extension\RuntimeExtensionInterface;

class RenderAttributesRuntime implements RuntimeExtensionInterface
{
    public function __construct()
    {
        // Inject dependencies if needed
    }

    public function render(array $value): string
    {
        $attributes = [];
        foreach ($value as $key => $val) {
            if (is_bool($val)) {
                if ($val) {
                    $attributes[] = $key;
                }
            } elseif (is_array($val)) {
                $attributes[] = $key . '=' . implode(' ', $val);
            } else {
                $attributes[] = $key . '=' . $val;
            }
        }

        return implode(' ', $attributes);
    }
}
