<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        #[Autowire('%kernel.project_dir%/public/images/users')] private readonly string $imagesDir,
        private readonly Filesystem $filesystem
    )
    {}

    public function load(ObjectManager $manager): void
    {
        for ($i = 1; $i <= 2; $i++) {
            $user = (new User())
                ->setName("User $i")
                ->setEmail('user' . $i . '@example.com')
                ->setUsername("user$i")
                ->setName("User $i")
                ->setImage('default-image.jpg');

            $user->setPassword($this->passwordHasher->hashPassword($user, 'password'));
            $manager->persist($user);
        }

        $this->deleteAllUsersImages();
        $manager->flush();

        $manager->flush();
    }

    private function deleteAllUsersImages(): void
    {
        $files = array_diff(scandir($this->imagesDir), array('.', '..', 'default-image.jpg'));

        foreach ($files as $file) {
            $this->filesystem->remove($this->imagesDir . '/' . $file);
        }
    }
}
