import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'dart:io' show Platform;

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
  FlutterLocalNotificationsPlugin();

  static bool _isInitialized = false;

  // Bildirishnomalarni ishga tushirish
  static Future<void> initNotifications() async {
    if (_isInitialized) return;

    debugPrint('📱 Bildirishnomalar ishga tushirilmoqda...');

    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsIOS =
    DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    // Android uchun bildirishnoma kanallarini yaratish
    await _createNotificationChannels();

    // Android uchun ruxsat so'rash
    if (Platform.isAndroid) {
      await _notificationsPlugin
          .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
          ?.requestNotificationsPermission();
    }

    // Bildirishnomalarni ishga tushirish
    await _notificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint('🔔 Bildirishnoma bosildi: ${response.payload}');
      },
    );

    // iOS uchun ruxsat so'rash
    if (Platform.isIOS) {
      await _notificationsPlugin
          .resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin>()
          ?.requestPermissions(
        alert: true,
        badge: true,
        sound: true,
      );
    }

    _isInitialized = true;
    debugPrint('✅ Bildirishnomalar muvaffaqiyatli ishga tushirildi!');
  }

  // Bildirishnoma kanallarini yaratish
  static Future<void> _createNotificationChannels() async {
    const List<AndroidNotificationChannel> channels = [
      AndroidNotificationChannel(
        'new_order_channel',
        'Yangi Buyurtmalar',
        description: 'Yangi buyurtmalar haqida bildirishnomalar',
        importance: Importance.max,
        playSound: true,
        enableVibration: true,
        sound: RawResourceAndroidNotificationSound('notification'),
      ),
      AndroidNotificationChannel(
        'order_updates_channel',
        'Buyurtma Yangilanishlari',
        description: 'Buyurtma holati o\'zgarishlari haqida bildirishnomalar',
        importance: Importance.high,
        playSound: true,
        enableVibration: true,
      ),
      AndroidNotificationChannel(
        'general_channel',
        'Umumiy Bildirishnomalar',
        description: 'Umumiy bildirishnomalar',
        importance: Importance.defaultImportance,
        playSound: true,
      ),
    ];

    final androidImplementation = _notificationsPlugin
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      for (final channel in channels) {
        await androidImplementation.createNotificationChannel(channel);
      }
    }
  }

  // Yangi buyurtma haqida bildirishnoma
  static Future<void> showNewOrderNotification() async {
    await showNotification(
      '🆕 Yangi Buyurtma!',
      'Sizga yangi buyurtma keldi',
    );
  }

  // Buyurtma tayinlanganligi haqida bildirishnoma
  static Future<void> showOrderAssignedNotification() async {
    await showNotification(
      '👤 Buyurtma Tayinlandi!',
      'Sizga buyurtma tayinlandi',
    );
  }

  // Umumiy bildirishnoma
  static Future<void> showNotification(String title, String body, {String? payload}) async {
    const AndroidNotificationDetails androidNotificationDetails =
    AndroidNotificationDetails(
      'general_channel',
      'Umumiy Bildirishnomalar',
      channelDescription: 'Umumiy bildirishnomalar',
      importance: Importance.defaultImportance,
      priority: Priority.defaultPriority,
      playSound: true,
      enableVibration: true,
      icon: '@mipmap/ic_launcher',
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
      iOS: DarwinNotificationDetails(
        sound: 'default',
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _notificationsPlugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000, // Unique ID
      title,
      body,
      notificationDetails,
      payload: payload ?? 'general',
    );

    debugPrint('🔔 Umumiy bildirishnoma yuborildi: $title');
  }

  // Buyurtma yetkazilayotganligi haqida bildirishnoma
  static Future<void> showDeliveringNotification() async {
    await showNotification(
      '🚚 Buyurtma Yetkazilmoqda',
      'Buyurtma yetkazib berilish jarayoni boshlandi',
    );
  }
  // Buyurtma tayyor bo'lganligi haqida bildirishnoma
  static Future<void> showPreparingCompletedNotification() async {
    const AndroidNotificationDetails androidNotificationDetails =
    AndroidNotificationDetails(
      'order_updates_channel',
      'Buyurtma Yangilanishlari',
      channelDescription: 'Buyurtma tayyor bo‘lganda bildirishnoma',
      importance: Importance.high,
      priority: Priority.high,
      playSound: true,
      enableVibration: true,
      icon: '@mipmap/ic_launcher',
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
      iOS: DarwinNotificationDetails(
        sound: 'default',
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _notificationsPlugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      '🛠 Buyurtma Tayyor!',
      'Buyurtma yetkazib berishga tayor!',
      notificationDetails,
      payload: 'preparing_completed',
    );
  }

  // Buyurtma yetkazib berilganligi haqida bildirishnoma
  static Future<void> showOrderCompletedNotification() async {
    await showNotification(
      '✅ Buyurtma Yetkazildi',
      'Buyurtma muvaffaqiyatli yetkazib berildi',
    );
  }

  // Buyurtma bekor qilinganligi haqida bildirishnoma
  static Future<void> showOrderCancelledNotification() async {
    await showNotification(
      '❌ Buyurtma Bekor Qilindi',
      'Buyurtma bekor qilindi',
    );
  }

  // Buyurtma holati o'zgarganligi haqida bildirishnoma
  static Future<void> showOrderUpdatedNotification() async {
    await showNotification(
      '🔄 Buyurtma Yangilandi',
      'Buyurtma holati o\'zgartirildi',
    );
  }

  // Barcha bildirishnomalarni o'chirish
  static Future<void> cancelAllNotifications() async {
    await _notificationsPlugin.cancelAll();
    debugPrint('🗑️ Barcha bildirishnomalar o\'chirildi');
  }

  // Ma'lum bir bildirishnomani o'chirish
  static Future<void> cancelNotification(int id) async {
    await _notificationsPlugin.cancel(id);
    debugPrint('🗑️ Bildirishnoma o\'chirildi: $id');
  }
}