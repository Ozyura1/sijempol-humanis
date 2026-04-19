<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasUuids, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function idCards()
    {
        return $this->hasMany(IDCard::class);
    }

    public function births()
    {
        return $this->hasMany(Birth::class);
    }

    public function deaths()
    {
        return $this->hasMany(Death::class);
    }

    public function marriages()
    {
        return $this->hasMany(Marriage::class);
    }

    public function moves()
    {
        return $this->hasMany(Move::class);
    }

    public function familyCards()
    {
        return $this->hasMany(FamilyCard::class);
    }
}