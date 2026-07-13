<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HazardApiController extends Controller
{
    /**
     * Return a sample GeoJSON FeatureCollection of hazards (demo).
     */
    public function index(Request $request)
    {
        $sample = [
            'type' => 'FeatureCollection',
            'features' => [
                [
                    'type' => 'Feature',
                    'properties' => [
                        'name' => 'Vùng nguy hiểm mẫu - Ma Pi Lèng (demo)',
                        'risk_level' => 'high'
                    ],
                    'geometry' => [
                        'type' => 'Polygon',
                        'coordinates' => [
                            [
                                [105.414,22.430],
                                [105.425,22.430],
                                [105.425,22.440],
                                [105.414,22.440],
                                [105.414,22.430]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return response()->json($sample);
    }
}
