<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Send forum like notification
     */
    public function forumLike($topicOrPostId, $type, $likerUser, $ownerUserId, $title)
    {
        if ($likerUser->id === $ownerUserId) {
            return; // Don't notify yourself
        }

        $link = "/forum/topics/{$topicOrPostId}";

        Notification::create([
            'user_id' => $ownerUserId,
            'type' => 'forum_like',
            'title' => 'Someone liked your post',
            'message' => "{$likerUser->name} liked your {$type}: \"{$title}\"",
            'link' => $link,
            'icon' => '❤️',
        ]);
    }

    /**
     * Send forum reply notification
     */
    public function forumReply($topicId, $topicOwnerId, $replierUser, $topicTitle)
    {
        if ($replierUser->id === $topicOwnerId) {
            return; // Don't notify yourself
        }

        Notification::create([
            'user_id' => $topicOwnerId,
            'type' => 'forum_reply',
            'title' => 'New reply on your topic',
            'message' => "{$replierUser->name} replied to: \"{$topicTitle}\"",
            'link' => "/forum/topics/{$topicId}",
            'icon' => '💬',
        ]);
    }

    /**
     * Send new message notification
     */
    public function newMessage($chatId, $senderId, $receiverId, $senderName, $listingTitle)
    {
        Notification::create([
            'user_id' => $receiverId,
            'type' => 'message',
            'title' => 'New message',
            'message' => "{$senderName} sent you a message about: \"{$listingTitle}\"",
            'link' => "/dashboard/messages",
            'icon' => '✉️',
        ]);
    }

    /**
     * Send offer notification
     */
    public function newOffer($listingId, $listingTitle, $offererId, $offererName, $amount, $sellerId)
    {
        Notification::createForUser(
            $sellerId,
            'offer',
            '💰 New offer received',
            "{$offererName} made an offer of €{$amount} on: \"{$listingTitle}\"",
            [
                'offerer_id' => $offererId,
                'offerer_name' => $offererName,
                'listing_id' => $listingId,
                'amount' => $amount,
                'link' => "/listings/{$listingId}",
            ]
        );
    }

    /**
     * Send offer accepted notification
     */
    public function offerAccepted($listingId, $listingTitle, $offererId, $sellerName, $amount)
    {
        Notification::createForUser(
            $offererId,
            'offer_accepted',
            '✅ Offer accepted!',
            "{$sellerName} accepted your offer of €{$amount} on: \"{$listingTitle}\"",
            [
                'listing_id' => $listingId,
                'amount' => $amount,
                'link' => "/listings/{$listingId}",
            ]
        );
    }

    /**
     * Send offer rejected notification
     */
    public function offerRejected($listingId, $listingTitle, $offererId, $sellerName, $amount)
    {
        Notification::createForUser(
            $offererId,
            'offer_rejected',
            '❌ Offer declined',
            "{$sellerName} declined your offer of €{$amount} on: \"{$listingTitle}\"",
            [
                'listing_id' => $listingId,
                'amount' => $amount,
                'link' => "/listings/{$listingId}",
            ]
        );
    }

    /**
     * Get unread count for user
     */
    public function getUnreadCount($userId)
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }

    /**
     * Mark all as read for user
     */
    public function markAllAsRead($userId)
    {
        Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);
    }
}

