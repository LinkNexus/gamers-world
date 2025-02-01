<?php

namespace App\Config;

enum Gender: string
{
    case Male = 'male';
    case Female = 'female';
    case Other = 'other';
}
