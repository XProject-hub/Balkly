<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'title',
        'description',
        'company',
        'location',
        'city',
        'country',
        'salary_min',
        'salary_max',
        'salary_currency',
        'category',
        'contract_type',
        'contract_time',
        'redirect_url',
        'source',
        'employer_logo',
        'created_date',
        'status',
        'metadata',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'created_date' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Scope for active jobs
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for UAE jobs
     */
    public function scopeUae($query)
    {
        return $query->where('country', 'AE');
    }

    /**
     * Get formatted salary range
     */
    public function getSalaryRangeAttribute()
    {
        if (!$this->salary_min && !$this->salary_max) {
            return 'Salary not specified';
        }

        $currency = $this->salary_currency ?? 'AED';
        
        if ($this->salary_min && $this->salary_max) {
            return "{$currency} " . number_format($this->salary_min) . " - " . number_format($this->salary_max);
        }
        
        if ($this->salary_min) {
            return "{$currency} " . number_format($this->salary_min) . "+";
        }
        
        return "Up to {$currency} " . number_format($this->salary_max);
    }
}
