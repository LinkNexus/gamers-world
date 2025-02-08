<?php

namespace App\Twig\Runtime;

use Twig\Extension\RuntimeExtensionInterface;

class RenderReactComponentRuntime implements RuntimeExtensionInterface
{
    public function __construct()
    {
        // Inject dependencies if needed
    }

    /**
     * Renders a React component by defining the stimulus controller
     * and passing it the component name and props.
     * @param string $name
     * @param array $props
     * @return string
     */
    public function render(string $name, array $props = []): string
    {
        $output = "data-controller=render-react data-render-react-component-value=$name";

        if (!empty($props)) {
            $output .= " data-render-react-props-value=" . json_encode($props);
        }

        return $output;
    }
}
