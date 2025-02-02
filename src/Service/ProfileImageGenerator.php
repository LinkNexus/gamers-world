<?php

namespace App\Service;

use App\Enum\FileType;
use App\Enum\Gender;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class ProfileImageGenerator
{
//    private const string generatorByNameEndPoint = "https://avatar.iran.liara.run/username?username=";
//
//    private const string generatorRandomEndPoint = "https://avatar.iran.liara.run/public";

    private const string generatorByNameEndPoint = "username/";
    private const string generatorRandomEndPoint = "public/";

    private const array genders = [
        'male' => 'boy',
        'female' => 'girl',
        'other' => ''
    ];


    public function __construct(
        private readonly HttpClientInterface                                            $imageGeneratorClient,
        #[Autowire('%kernel.project_dir%/public/images/users')] private readonly string $imagesDir, private readonly RequestStack $requestStack
    )
    {}

    public function generateImageByName(string $name, string $identifier, FileType $format = FileType::WEBP): ?string
    {
        try {
//            $resource = $this->requestImage(self::generatorByNameEndPoint . $name);
            $resource = $this->requestImage(self::generatorByNameEndPoint, [
                'query' => [
                    'username' => $name
                ]
            ]);
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
//            $resource = $this->requestImage(self::generatorRandomEndPoint . '/' . self::genders[$gender->value]);
            $resource = $this->requestImage(self::generatorRandomEndPoint . self::genders[$gender->value]);
        } catch (\Exception $exception) {
            return null;
        }

        $imageName = $this->generateRandomImageName($identifier, $format);
        $result = $this->storeImage($resource, $imageName, $format);

        return $result ? $imageName : null;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    private function requestImage(string $url, array $options = []): false|\GdImage
    {
        return imagecreatefromstring(
            $this->imageGeneratorClient
                ->request('GET', $url, $options)
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