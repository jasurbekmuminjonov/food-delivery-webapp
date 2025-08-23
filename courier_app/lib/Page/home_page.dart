  import 'package:bot_dostopa/Global/api_config.dart';
  import 'package:flutter/material.dart';
  import 'package:get/Get.dart';
  import 'package:url_launcher/url_launcher.dart';
  import '../Controller/Login_controller.dart';
  import '../Controller/Product_controller.dart';
  import '../Global/Socet.dart';
  import '../Global/Token_save.dart';
  import 'dart:convert';
  import '../Model/ProducModel.dart';
  import 'notification.dart';

  class OrdersPage extends StatefulWidget {
    const OrdersPage({super.key});

    @override
    State<OrdersPage> createState() => _OrdersPageState();
  }

  class _OrdersPageState extends State<OrdersPage> {
    List<Order> allOrders = [];
    bool isLoading = true;
    String? error;

    int _currentIndex = 0;
    String? token;
    String? courierId;
    bool _isSocketConnected = false;

    int _refreshKey = 0;

    @override
    void initState() {
      super.initState();
      print("🚀 OrdersPage initState boshlandi");

      _initializeNotifications();
      _loadInitialData();

      Future.delayed(const Duration(milliseconds: 500), () {
        _initializeSocket();
      });

      print("🏁 OrdersPage initState tugadi");
    }

    Future<void> _initializeNotifications() async {
      try {
        await NotificationService.initNotifications();
        print("✅ Bildirishnomalar muvaffaqiyatli ishga tushirildi");
      } catch (e) {
        print("❌ Bildirishnomalar ishga tushirishda xatolik: $e");
      }
    }

    Future<void> _initializeSocket() async {
      try {
        print("🔌 Socket initialize boshlandi...");
        await SocketService.initSocket();

        SocketService.removeListener(_onSocketEvent);
        SocketService.addListener(_onSocketEvent);

        print("✅ Socket listeneri qo'shildi: _onSocketEvent");
        _updateSocketStatus();
        _startSocketStatusMonitoring();
      } catch (e) {
        print("❌ Socket boshlashda xatolik: $e");
        Future.delayed(const Duration(seconds: 5), () {
          if (mounted && !SocketService.isConnected) {
            print("🔄 Socket qayta ulanmoqda...");
            _initializeSocket();
          }
        });
      }
    }

    void _startSocketStatusMonitoring() {
      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) {
          _updateSocketStatus();
          _startSocketStatusMonitoring();
        }
      });
    }

    void _updateSocketStatus() {
      if (mounted) {
        final isConnected = SocketService.isConnected;
        if (_isSocketConnected != isConnected) {
          setState(() {
            _isSocketConnected = isConnected;
          });
          print("📡 Soket holati yangilandi: $_isSocketConnected");
        }
      }
    }

    Future<void> _loadOrders() async {
      print("📥 Buyurtmalar yuklanmoqda...");

      if (!mounted) return;

      setState(() {
        isLoading = true;
        error = null;
      });

      try {
        final orders = await ProductService.getOrders();

        if (mounted) {
          setState(() {
            allOrders = orders;
            isLoading = false;
            _refreshKey++;
          });

          print("📋 ${orders.length} ta buyurtma yuklandi");

          final myOrders = orders.where((o) => o.courier?.id == courierId).toList();
          print("👤 Menga tegishli: ${myOrders.length} ta buyurtma");

          final deliveringOrders = myOrders.where((o) => o.orderStatus == "delivering").toList();
          final completedOrders = myOrders.where((o) => o.orderStatus == "completed").toList();

          print("🚚 Delivering: ${deliveringOrders.length} ta");
          print("✅ Completed: ${completedOrders.length} ta");

          for (var order in deliveringOrders) {
            print("   - DELIVERING: ${order.id.substring(0, 8)}... Status: ${order.orderStatus}");
          }
        }
      } catch (e) {
        print("❌ Buyurtmalarni yuklashda xatolik: $e");
        if (mounted) {
          setState(() {
            error = e.toString();
            isLoading = false;
          });
        }
      }
    }

    Future<void> _loadInitialData() async {
      try {
        final tokenValue = await TokenSave.getToken();
        if (tokenValue != null) {
          setState(() {
            token = tokenValue;
            courierId = getCourierIdFromToken(tokenValue);
            print("✅ Token: $token");
            print("✅ Courier ID: $courierId");
          });
        }
      } catch (e) {
        print("❌ Token olishda xatolik: $e");
      }

      await _loadOrders();
    }

// OrdersPage.dart ichidagi _onSocketEvent metodining yangi versiyasi

    void _onSocketEvent(String event, dynamic data) {
      // Data strukturasini tekshirish
      String? orderStatus;
      String? orderId;

      if (data is Map<String, dynamic>) {
        orderStatus = data['order_status'] ?? data['status'] ?? data['orderStatus'];
        orderId = data['order_id'] ?? data['id'] ?? data['orderId'] ?? data['_id'];
      }

      switch (event) {
        case 'preparing_completed':
          print("🛠 PREPARING_COMPLETED ishlov berilmoqda");
          print("🛠 Ma'lumot: $data");

          setState(() {
            _immediateRefresh();
          });

          NotificationService.showPreparingCompletedNotification();
          _showSnackBar("🛠 Buyurtma tayyor! Olib ketishingiz mumkin.");

          if (_currentIndex != 0) {
            print("📍 Preparing completed - Aktiv tabga o'tkazish");
            setState(() {
              _currentIndex = 0;
            });
          }

          Future.delayed(const Duration(seconds: 1), () {
            if (mounted) {
              print("🔄 Preparing completed dan keyin qo'shimcha yangilash...");
              setState(() {
                _immediateRefresh();
              });
            }
          });
          break;

        case 'delivering':
          print("🚴 DELIVERING ishlov berilmoqda");
          print("🚴 Ma'lumot: $data");
          _immediateRefresh();
          NotificationService.showDeliveringNotification();
          if (_currentIndex != 0) {
            print("📍 Delivering - Aktiv tabga o'tkazish");
            setState(() {
              _currentIndex = 0;
            });
          }
          break;

        case 'complete_delivering':
          print("✅ COMPLETE_DELIVERING ishlov berilmoqda");
          print("✅ Ma'lumot: $data");

          _immediateRefresh();
          NotificationService.showOrderCompletedNotification();
          _showSnackBar("✅ Buyurtma muvaffaqiyatli yetkazib berildi!");

          setState(() {
            _currentIndex = 1;
          });

          Future.delayed(const Duration(seconds: 2), () {
            if (mounted) {
              print("🔄 Complete delivering dan keyin qo'shimcha yangilash...");
              _immediateRefresh();
            }
          });
          break;

        case 'order_status_updated':
          print("🔄 ORDER_STATUS_UPDATED ishlov berilmoqda");
          print("🔄 Status: $orderStatus");

          if (orderStatus == 'preparing_completed' || orderStatus == 'ready') {
            print("🛠 Order ready for pickup");
            _immediateRefresh();
            NotificationService.showPreparingCompletedNotification();
            _showSnackBar("🛠 Buyurtma tayyor! Olib ketishingiz mumkin.");

          } else if (orderStatus == 'delivering') {
            print("🚴 Order assigned for delivery");
            _immediateRefresh();
            NotificationService.showDeliveringNotification();
            _showSnackBar("🚴 Buyurtma sizga biriktirildi!");

          } else if (orderStatus == 'completed') {
            print("✅ Order completed");
            _immediateRefresh();
            NotificationService.showOrderCompletedNotification();
            _showSnackBar("✅ Buyurtma yakunlandi!");

            setState(() {
              _currentIndex = 1;
            });

          } else {
            print("🔄 Order status updated to: $orderStatus");
            _immediateRefresh();
            _showSnackBar("🔄 Buyurtma holati yangilandi");
          }
          break;

        case 'order_canceled':
          print("❌ ORDER_CANCELLED ishlov berilmoqda");
          print("❌ Ma'lumot: $data");

          _immediateRefresh();
          NotificationService.showOrderCancelledNotification();
          _showSnackBar("❌ Buyurtma bekor qilindi!");

          // Kerak bo'lsa tabni ham o'zgartirish
          if (_currentIndex != 0) {
            setState(() {
              _currentIndex = 0;
            });
          }
          break;

        case 'order_updated':
          print("📝 ORDER_UPDATED ishlov berilmoqda");
          _immediateRefresh();
          _showSnackBar("📝 Buyurtma ma'lumotlari yangilandi");
          break;

        default:
          print("📡 Boshqa event: $event");
          print("📡 Ma'lumot: $data");

          _immediateRefresh();

          if (event.toLowerCase().contains('complete') ||
              event.toLowerCase().contains('delivered')) {
            print("🔄 Complete-ga oid event: $event");
            NotificationService.showOrderCompletedNotification();
            _showSnackBar("✅ Buyurtma tugallandi!");

            setState(() {
              _currentIndex = 1;
            });

          } else if (event.toLowerCase().contains('preparing') ||
              event.toLowerCase().contains('ready')) {
            print("🔄 Preparing-ga oid event: $event");
            NotificationService.showPreparingCompletedNotification();
            _showSnackBar("🛠 Buyurtma tayyor bo'ldi!");

          } else if (event.toLowerCase().contains('delivering') ||
              event.toLowerCase().contains('assigned')) {
            print("🔄 Delivering-ga oid event: $event");
            NotificationService.showDeliveringNotification();
            _showSnackBar("🚴 Buyurtma tayinlandi!");

          } else {
            _showSnackBar("📡 Yangi xabar: ${event.replaceAll('_', ' ')}");
          }
          break;
      }

      print("🏁 _onSocketEvent tugadi - Event: $event");
    }
    Future<void> _immediateRefresh() async {
      if (!mounted) {
        return;
      }
      try {
        setState(() {
          isLoading = true;
        });

        final freshOrders = await ProductService.getOrders();

        if (mounted) {
          setState(() {
            allOrders = freshOrders;
            isLoading = false;
            _refreshKey++;
          });
          final myDeliveringOrders = freshOrders
              .where((o) => o.courier?.id == courierId && o.orderStatus == "delivering")
              .toList();
          for (var order in myDeliveringOrders) {
            print("   - ID: ${order.id.substring(0, 8)}... Status: ${order.orderStatus}");
          }
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            isLoading = false;
            error = e.toString();
          });
        }
      }
    }

    void _showSnackBar(String message) {
      if (mounted && message.isNotEmpty) {
        print("🔔 SnackBar ko'rsatilmoqda: $message");
        ScaffoldMessenger.of(context).clearSnackBars();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(message),
            duration: const Duration(seconds: 3),
            behavior: SnackBarBehavior.floating,
            action: SnackBarAction(
              label: 'OK',
              onPressed: () {
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
              },
            ),
          ),
        );
      }
    }

    @override
    void dispose() {
      print("🗑️ OrdersPage dispose boshlandi");
      SocketService.removeListener(_onSocketEvent);
      print("🗑️ Soket listeneri o'chirildi");
      super.dispose();
    }

    String getCourierIdFromToken(String token) {
      try {
        final parts = token.split('.');
        if (parts.length != 3) {
          throw Exception('Noto\'g\'ri JWT token');
        }
        final payload = parts[1];
        final decoded = base64Url.decode(base64Url.normalize(payload));
        final payloadMap = jsonDecode(utf8.decode(decoded)) as Map<String, dynamic>;
        return payloadMap['id']?.toString() ?? '';
      } catch (e) {
        print('❌ Token dekodlashda xatolik: $e');
        return '';
      }
    }

    Future<void> _openMap(double lat, double long) async {
      final Uri url = Uri.parse("https://www.google.com/maps/dir/?api=1&destination=$lat,$long");
      try {
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        } else {
          throw 'Could not launch $url';
        }
      } catch (e) {
        print("❌ Map ochishda xatolik: $e");
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("❌ Google Maps ochib bo'lmadi")),
          );
        }
      }
    }

    void _showPaymentDialog(String orderId) {
      showDialog(
        context: context,
        builder: (context) {
          String? selectedPayment;
          return AlertDialog(
            title: const Text("To'lov turini tanlang"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                RadioListTile<String>(
                  title: const Text("Naqd (Cash)"),
                  value: "cash",
                  groupValue: selectedPayment,
                  onChanged: (val) {
                    Navigator.of(context).pop();
                    if (val != null) {
                      _confirmComplete(orderId, val);
                    }
                  },
                ),
                RadioListTile<String>(
                  title: const Text("Karta (Card)"),
                  value: "card",
                  groupValue: selectedPayment,
                  onChanged: (val) {
                    Navigator.of(context).pop();
                    if (val != null) {
                      _confirmComplete(orderId, val);
                    }
                  },
                ),
              ],
            ),
          );
        },
      );
    }

    void _confirmComplete(String orderId, String paymentMethod) {
      showDialog(
        context: context,
        builder: (dialogContext) {
          return AlertDialog(
            title: const Text("Tasdiqlash"),
            content: Text("Buyurtmani yopmoqchimisiz?\nTo'lov turi: $paymentMethod"),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(dialogContext).pop();
                },
                child: const Text("Yo'q"),
              ),
              ElevatedButton(
                onPressed: () async {
                  Navigator.of(dialogContext).pop();

                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (loadingContext) => const AlertDialog(
                      content: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          SizedBox(width: 16),
                          Text("Kutib turing..."),
                        ],
                      ),
                    ),
                  );

                  try {
                    bool ok = await ProductService.completeDelivering(orderId, paymentMethod)
                        .timeout(
                      const Duration(seconds: 30),
                      onTimeout: () => throw Exception("Timeout: Buyurtmani yopish vaqti o'tib ketdi"),
                    );

                    if (mounted) Navigator.of(context).pop();

                    if (ok) {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("✅ Buyurtma muvaffaqiyatli yopildi")),
                        );

                        NotificationService.showOrderCompletedNotification();

                        print("🔄 Buyurtma yopildi, darhol yangilash...");
                        await _immediateRefresh();

                        setState(() {
                          _currentIndex = 1;
                        });

                        Future.delayed(const Duration(milliseconds: 2000), () {
                          if (mounted) {
                            print("🔄 Buyurtma yopilgandan keyin qo'shimcha yangilash...");
                            _immediateRefresh();
                          }
                        });
                      }
                    } else {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("❌ Buyurtmani yopishda xatolik yuz berdi"),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  } catch (e) {
                    if (mounted) Navigator.of(context).pop();
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("❌ Xatolik: $e"),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
                child: const Text("Ha"),
              ),
            ],
          );
        },
      );
    }

    String _getLastSixDigits(String id) {
      return id.length >= 6 ? id.substring(id.length - 6) : id;
    }

    Future<void> _onRefresh() async {
      print("🔄 Qo'lda yangilash boshlandi");

      if (!SocketService.isConnected) {
        print("🔄 Soket qayta ulanmoqda...");
        try {
          await SocketService.reconnect();
          print("🔄 Soket qayta ulanish muvaffaqiyatli");
        } catch (e) {
          print("❌ Soket qayta ulanishda xatolik: $e");
        }
      }

      await _immediateRefresh();
    }

    @override
    Widget build(BuildContext context) {
      return Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Get.offAllNamed('/');
            },
          ),
          title: const Text(
            "Buyurtmalar",
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: Colors.deepPurple,
          actions: [
            IconButton(
              onPressed: _onRefresh,
              icon: const Icon(Icons.refresh, color: Colors.white),
              tooltip: "Yangilash",
            ),
            Container(
              margin: const EdgeInsets.only(right: 16),
              child: Icon(
                _isSocketConnected ? Icons.wifi : Icons.wifi_off,
                color: _isSocketConnected ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                onRefresh: _onRefresh,
                child: _buildOrdersList(),
              ),
            ),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          selectedItemColor: Colors.deepPurple,
          unselectedItemColor: Colors.grey,
          onTap: (index) => setState(() => _currentIndex = index),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.list), label: "Aktiv"),
            BottomNavigationBarItem(icon: Icon(Icons.local_shipping), label: "Yetkazilgan"),
          ],
        ),
      );
    }

    Widget _buildOrdersList() {
      if (isLoading) {
        return const Center(child: CircularProgressIndicator());
      }

      if (error != null) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("❌ Xatolik: $error"),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _onRefresh,
                child: const Text("Qayta urinish"),
              ),
            ],
          ),
        );
      }

      final myOrders = allOrders.where((o) => o.courier?.id == courierId).toList();

      final filteredOrders = _currentIndex == 0
          ? myOrders.where((o) => o.orderStatus == "delivering").toList()
          : myOrders.where((o) => o.orderStatus == "completed").toList();

      if (filteredOrders.isEmpty) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _currentIndex == 0 ? Icons.inbox : Icons.history,
                size: 64,
                color: Colors.grey,
              ),
              const SizedBox(height: 16),
              Text(
                _currentIndex == 0
                    ? "❌ Hozircha aktiv buyurtmalar yo'q"
                    : "❌ Hozircha yetkazilgan buyurtmalar yo'q",
                style: const TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _onRefresh,
                child: const Text("Yangilash"),
              ),
            ],
          ),
        );
      }

      return ListView.builder(
        key: ValueKey(_refreshKey),
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: filteredOrders.length,
        itemBuilder: (context, index) {
          final order = filteredOrders[index];
          return Card(
            margin: const EdgeInsets.all(10),
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "🆔 Buyurtma ID: ${_getLastSixDigits(order.id)}",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: order.orderStatus == "delivering" ? Colors.blue :
                          order.orderStatus == "preparing" ? Colors.orange :
                          Colors.green,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          order.orderStatus.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text("📦 Ism: ${order.courier?.courierName}"),
                  Text("📦 Holat: ${order.orderStatus}"),
                  Text("💳 To'lov: ${order.paymentMethod}"),
                  Text("👨 Yetkazuvchi: ${order.requestedCourier}"),
                  Text("💰 Umumiy Narx: ${order.totalPrice} so'm"),
                  Text("🚚 Yetkazib berish haqi: ${order.deliveryFee} so'm"),
                  Text("👤 Foydalanuvchi: ${order.user.userName}"),
                  Text("🚴 Yetkazuvchi: ${order.courier?.courierName ?? 'Belgilamagan'}"),
                  const Divider(),
                  const Text(
                    "🛒 Mahsulotlar:",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  Column(
                    children: order.products.map((p) {
                      String imageUrl = p.product.imageUrl;

                      if (imageUrl.contains("localhost")) {
                        imageUrl = imageUrl.replaceAll("localhost", "${ApiConfig.baseUrlImg}");
                      }
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
                        child: ListTile(
                          leading: imageUrl.isNotEmpty
                              ? Image.network(
                            imageUrl,
                            width: 50,
                            height: 50,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              print("Rasm yuklanmadi: $error");
                              return const Icon(Icons.broken_image, size: 50);
                            },
                          )
                              : const Icon(Icons.image_not_supported, size: 50),
                          title: Text(p.product.productName),
                          subtitle: Text("Soni: ${p.quantity} | ${p.product.unitDescription}"),
                          trailing: Text("${p.salePrice} so'm"),
                        ),
                      );
                    }).toList(),
                  ),

                  if (order.orderStatus == "delivering") ...[
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () =>
                                _openMap(order.orderAddress.lat, order.orderAddress.long),
                            icon: const Icon(Icons.map),
                            label: const Text("Yo'lni ko'rish"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () => _showPaymentDialog(order.id),
                            icon: const Icon(Icons.check_circle),
                            label: const Text("Yopish"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      );
    }
  }