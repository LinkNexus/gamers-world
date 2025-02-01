<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

readonly final class FileUploader
{
    public function __construct(
        private readonly SluggerInterface $slugger,
        #[Autowire('%kernel.project_dir%/public')] private readonly string $baseDirectory
    )
    {}

    public function upload(UploadedFile $file, string $directory, ?string $fileName = null): string
    {
        if (!$fileName) {
            $fileName = $this->renameFile($file);
        }

        $directory = $this->baseDirectory . $directory;
        $file->move($directory, $fileName);

        return $fileName;
    }

    private function renameFile(UploadedFile $file): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        return $safeFilename.'-'.uniqid().'.'.$file->guessExtension();
    }
}