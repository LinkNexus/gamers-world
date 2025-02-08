<?php

namespace App\Twig\Extension;

use App\Twig\Runtime\RenderReactComponentRuntime;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class RenderReactComponentExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('react_component', [RenderReactComponentRuntime::class, 'render']),
        ];
    }
}
