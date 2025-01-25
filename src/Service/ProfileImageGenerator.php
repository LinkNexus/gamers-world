<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class ProfileImageGenerator
{
    private const string apiEndPoint = "https://avatar.iran.liara.run/username?username=";

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        #[Autowire('%kernel.project_dir%/public/images/users')] private readonly string $imagesDir
    )
    {}

//    public function generateRandomImage() {
//
//    }

    public function generateImageByName(string $name, string $identifier): ?string
    {
        try {
            $resource = imagecreatefromstring(
                $this->httpClient
                    ->request('GET', self::apiEndPoint . $name)
                    ->getContent()
            );
        } catch (\Exception $exception) {
            return null;
        }

        $imageName = $this->generateRandomImageName($identifier);
        $result = $this->storeImage($resource, $imageName);

        return $result ? $imageName : null;
    }

    private function storeImage(false|\GdImage $resource, string $imageName): bool
    {
        return imagepng($resource, $this->imagesDir . '/' . $imageName);
    }

    private function generateRandomImageName(string $identifier): string
    {
        return $identifier . '-' . uniqid() . '.png';
    }
}