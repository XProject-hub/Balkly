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

        $link = $type === 'topic' 
            ? "/forum/topics/{$topicOrPostId}" 
            : "/forum/topics/{$topicOrPostId}"; // You'd need post's topic_id

        Notification::createForUser(
            $ownerUserId,
            'forum_like',
            '❤️ Someone liked your post',
            "{$likerUser->name} liked your {$type}: \"{$title}\"",
            [
                'liker_id' => $likerUser->id,
                'liker_name' => $likerUser->name,
                'type' => $type,
                'link' => $link,
            ]
        );
    }

    /**
     * Send forum reply notification
     */
    public function forumReply($topicId, $topicOwnerId, $replierUser, $topicTitle)
    {
        if ($replierUser->id === $topicOwnerId) {
            return; // Don't notify yourself
        }

        Notification::createForUser(
            $topicOwnerId,
            'forum_reply',
            '💬 New reply on your topic',
            "{$replierUser->name} replied to: \"{$topicTitle}\"",
            [
                'replier_id' => $replierUser->id,
                'replier_name' => $replierUser->name,
                'topic_id' => $topicId,
                'link' => "/forum/topics/{$topicId}",
            ]
        );
    }

    /**
     * Send new message notification
     */
    public function newMessage($chatId, $senderId, $receiverId, $senderName, $listingTitle)
    {
        Notification::createForUser(
            $receiverId,
            'message',
            '✉️ New message',
            "{$senderName} sent you a message about: \"{$listingTitle}\"",
            [
                'sender_id' => $senderId,
                'sender_name' => $senderName,
                'chat_id' => $chatId,
                'link' => "/dashboard/messages/{$chatId}",
            ]
        );
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

