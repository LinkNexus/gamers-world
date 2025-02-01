<?php

namespace App\Service;

use App\Config\FileType;
use App\Config\Gender;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class ProfileImageGenerator
{
    private const string generatorByNameEndPoint = "https://avatar.iran.liara.run/username?username=";

    private const string generatorRandomEndPoint = "https://avatar.iran.liara.run/public";
    private const array genders = [
        'male' => 'boy',
        'female' => 'girl',
        'other' => ''
    ];


    public function __construct(
        private readonly HttpClientInterface $httpClient,
        #[Autowire('%kernel.project_dir%/public/images/users')] private readonly string $imagesDir
    )
    {}

    public function generateImageByName(string $name, string $identifier, FileType $format = FileType::WEBP): ?string
    {
        try {
            $resource = $this->requestImage(self::generatorByNameEndPoint . $name);
        } catch (\Exception $exception) {
            return null;
        }

        $imageName = $this->generateRandomImageName($identifier, $format);
        $result = $this->storeImage($resource, $imageName, $format);

        return $result ? $imageName : null;
    }

    public function generateImageByGender(Gender $gender, string $identifier, FileType $format = FileType::WEBP): ?string
    {
        try {
            $resource = $this->requestImage(self::generatorRandomEndPoint . '/' . self::genders[$gender->value]);
        } catch (\Exception $exception) {
            return null;
        }

        $imageName = $this->generateRandomImageName($identifier, $format);
        $result = $this->storeImage($resource, $imageName, $format);

        return $result ? $imageName : null;
    }

    private function requestImage(string $url): false|\GdImage
    {
        return imagecreatefromstring(
            $this->httpClient
                ->request('GET', $url)
                ->getContent()
        );
    }

    private function storeImage(false|\GdImage $resource, string $imageName, FileType $format): bool
    {
        if ($resource === false) {
            return false;
        }

        return match ($format) {
            FileType::WEBP => imagewebp($resource, $this->imagesDir . '/' . $imageName),
            FileType::PNG => imagepng($resource, $this->imagesDir . '/' . $imageName),
            FileType::JPEG => imagejpeg($resource, $this->imagesDir . '/' . $imageName),
        };
    }

    private function generateRandomImageName(string $identifier, FileType $format): string
    {
        return $identifier . '-' . uniqid() . '.' . $format->value;
    }
}