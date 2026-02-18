<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{
    private function getSettingsPath(): string
    {
        return storage_path('app/platform_settings.json');
    }

    private function getDefaults(): array
    {
        return [
            'site_name' => 'Balkly',
            'default_currency' => 'EUR',
            'default_language' => 'en',
            'maintenance_mode' => false,
            'allow_registration' => true,
            'require_email_verification' => true,
        ];
    }

    private function loadSettings(): array
    {
        return Cache::remember('platform_settings', 3600, function () {
            $path = $this->getSettingsPath();
            if (File::exists($path)) {
                $data = json_decode(File::get($path), true);
                if (is_array($data)) {
                    return array_merge($this->getDefaults(), $data);
                }
            }
            return $this->getDefaults();
        });
    }

    private function saveSettings(array $settings): void
    {
        $path = $this->getSettingsPath();
        File::put($path, json_encode($settings, JSON_PRETTY_PRINT));
        Cache::forget('platform_settings');
    }

    public function index()
    {
        return response()->json(['settings' => $this->loadSettings()]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'sometimes|string|max:255',
            'default_currency' => 'sometimes|string|in:EUR,AED,GBP,BAM,RSD',
            'default_language' => 'sometimes|string|in:en,sr,hr,bs,ar',
            'maintenance_mode' => 'sometimes|boolean',
            'allow_registration' => 'sometimes|boolean',
            'require_email_verification' => 'sometimes|boolean',
        ]);

        $current = $this->loadSettings();
        $merged = array_merge($current, $validated);
        $this->saveSettings($merged);

        return response()->json([
            'message' => 'Settings saved successfully',
            'settings' => $merged,
        ]);
    }
}
