<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    private $allowedSections = ['hero', 'about', 'services', 'works'];

    /**
     * Get content for a specific section.
     */
    public function show(string $section)
    {
        if (! in_array($section, $this->allowedSections)) {
            return response()->json(['message' => 'Section tidak valid.'], 404);
        }

        $path = "content/{$section}.json";

        if (! Storage::exists($path)) {
            return response()->json($this->defaults($section));
        }

        return response()->json(json_decode(Storage::get($path), true));
    }

    /**
     * Update content for a specific section.
     */
    public function update(Request $request, string $section)
    {
        if (! in_array($section, $this->allowedSections)) {
            return response()->json(['message' => 'Section tidak valid.'], 404);
        }

        $data = $request->all();
        $path = "content/{$section}.json";

        Storage::put($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return response()->json(['message' => 'Konten berhasil disimpan.', 'data' => $data]);
    }

    /**
     * Upload an image and return the public URL.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->move(public_path('uploads/works'), $filename);

        return response()->json([
            'url'  => '/uploads/works/' . $filename,
            'name' => $filename,
        ]);
    }

    /**
     * Default content for each section.
     */
    private function defaults(string $section): array
    {
        $defaults = [
            'hero' => [
                'headline'    => 'Where Ideas\nBecome Identity',
                'subtitle'    => 'We craft brands, design experiences, and build digital products that make an impact.',
                'cta_primary' => 'See Our Work',
                'cta_secondary' => 'Get in Touch',
            ],
            'about' => [
                'title'       => 'We Are WBZ Creative Studio',
                'description' => 'A boutique creative agency based in Indonesia, specializing in brand identity, web design, and visual storytelling. We work with ambitious brands who want to stand out.',
                'stats'       => [
                    ['number' => '50+', 'label' => 'Projects Done'],
                    ['number' => '30+', 'label' => 'Happy Clients'],
                    ['number' => '5+',  'label' => 'Years Experience'],
                ],
            ],
            'services' => [
                'items' => [
                    ['id' => 1, 'icon' => 'Palette',      'title' => 'Brand Identity',   'description' => 'Logo design, visual identity systems, brand guidelines, and everything that makes your brand unforgettable.'],
                    ['id' => 2, 'icon' => 'Monitor',      'title' => 'Web Design',        'description' => 'Stunning, conversion-focused websites that are as beautiful as they are functional.'],
                    ['id' => 3, 'icon' => 'Camera',       'title' => 'Photography',       'description' => 'Product, lifestyle, and brand photography that tells your story with authenticity.'],
                    ['id' => 4, 'icon' => 'Film',         'title' => 'Motion Design',     'description' => 'Animations, video intros, and dynamic visuals that bring your brand to life.'],
                    ['id' => 5, 'icon' => 'PenTool',      'title' => 'Print Design',      'description' => 'Brochures, packaging, posters, and print materials crafted with precision.'],
                    ['id' => 6, 'icon' => 'TrendingUp',   'title' => 'Social Media',      'description' => 'Content strategy and design assets that grow your audience and build community.'],
                ],
            ],
            'works' => [
                'items' => [
                    ['id' => 1, 'image' => '/images/work-placeholder-1.jpg', 'title' => 'Nusantara Brewing Co.',   'category' => 'Brand Identity', 'tags' => ['Branding', 'Packaging']],
                    ['id' => 2, 'image' => '/images/work-placeholder-2.jpg', 'title' => 'Rasa Studio',            'category' => 'Web Design',     'tags' => ['Web', 'UI/UX']],
                    ['id' => 3, 'image' => '/images/work-placeholder-3.jpg', 'title' => 'Langit Coffee',          'category' => 'Brand Identity', 'tags' => ['Branding', 'Print']],
                    ['id' => 4, 'image' => '/images/work-placeholder-4.jpg', 'title' => 'Mentari Skincare',       'category' => 'Photography',    'tags' => ['Photo', 'Social']],
                    ['id' => 5, 'image' => '/images/work-placeholder-5.jpg', 'title' => 'Archipelago Ventures',   'category' => 'Brand Identity', 'tags' => ['Branding', 'Motion']],
                ],
            ],
        ];

        return $defaults[$section] ?? [];
    }
}
