<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    private $allowedSections = ['hero', 'about', 'works', 'video', 'events'];

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
     * Upload an image for Works and return the public URL.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
        ]);

        $file     = $request->file('image');
        $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->move(public_path('uploads/works'), $filename);

        return response()->json([
            'url'  => '/uploads/works/' . $filename,
            'name' => $filename,
        ]);
    }

    /**
     * Upload a video file for the Scaling Video section.
     * Accepts mp4 / webm, up to 200 MB.
     */
    public function uploadVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,webm,mov,ogg|max:204800', // 200MB max
        ]);

        if (! is_dir(public_path('uploads/video'))) {
            mkdir(public_path('uploads/video'), 0775, true);
        }

        $file     = $request->file('video');
        $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->move(public_path('uploads/video'), $filename);

        return response()->json([
            'url'  => '/uploads/video/' . $filename,
            'name' => $filename,
        ]);
    }

    /**
     * Upload a poster/thumbnail image for the video section.
     */
    public function uploadPoster(Request $request)
    {
        $request->validate([
            'poster' => 'required|image|max:5120', // 5MB max
        ]);

        if (! is_dir(public_path('uploads/video'))) {
            mkdir(public_path('uploads/video'), 0775, true);
        }

        $file     = $request->file('poster');
        $filename = 'poster_' . time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->move(public_path('uploads/video'), $filename);

        return response()->json([
            'url'  => '/uploads/video/' . $filename,
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
            'video' => [
                'type'   => 'url',
                'src'    => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'poster' => '',
                'label'  => 'WBZ Showreel',
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
            'events' => [
                'items' => [
                    [
                        'id' => 1,
                        'title' => 'WBZ Block Party: Vol. 5',
                        'date_day' => '12',
                        'date_month' => 'JUN',
                        'time' => '17:00 - LATE',
                        'location' => 'Laswi Heritage, Bandung',
                        'desc' => 'Our annual street block party returns with live street art, local rap collectives, and exclusive merch drop.',
                        'status' => 'active'
                    ],
                    [
                        'id' => 2,
                        'title' => 'Clubhouse Sessions: Electronic Soundscape',
                        'date_day' => '27',
                        'date_month' => 'JUN',
                        'time' => '20:00 - 02:00',
                        'location' => 'WBZ HQ, Bandung',
                        'desc' => 'An intimate club night showcasing underground house, techno, and ambient electronic artists.',
                        'status' => 'active'
                    ],
                    [
                        'id' => 3,
                        'title' => 'Street Culture Exhibition & Talk',
                        'date_day' => '08',
                        'date_month' => 'JUL',
                        'time' => '14:00 - 18:00',
                        'location' => 'Selasar Sunaryo Art Space, Bandung',
                        'desc' => 'A panel discussion and showcase of visual arts, skateboarding photography, and zine culture in Bandung.',
                        'status' => 'finished'
                    ]
                ]
            ],
        ];

        return $defaults[$section] ?? [];
    }
}
