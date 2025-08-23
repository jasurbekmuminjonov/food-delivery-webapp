class Order {
  final String id;
  final List<OrderProduct> products;
  final int deliveryFee;
  final bool bonus;
  final int totalPrice;
  final String orderStatus;
  final String paymentMethod;
  final String requestedCourier;
  final String cancellationReason;
  final String? preparedDate;
  final String? deliveredDate;
  final String? canceledDate;
  final User user;
  final Courier? courier;
  final OrderAddress orderAddress;
  final String createdDate;
  final String createdAt;
  final String updatedAt;

  Order({
    required this.id,
    required this.products,
    required this.deliveryFee,
    required this.bonus,
    required this.totalPrice,
    required this.orderStatus,
    required this.paymentMethod,
    required this.requestedCourier,
    required this.cancellationReason,
    this.preparedDate,
    this.deliveredDate,
    this.canceledDate,
    required this.user,
    this.courier,
    required this.orderAddress,
    required this.createdDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json["_id"] as String,
      products: (json["products"] as List)
          .map((e) => OrderProduct.fromJson(e))
          .toList(),
      deliveryFee: json["delivery_fee"] as int,
      bonus: json["bonus"] as bool,
      totalPrice: json["total_price"] as int,
      orderStatus: json["order_status"] as String,
      paymentMethod: json["payment_method"] as String,
      requestedCourier: json["requested_courier"] as String,
      cancellationReason: json["cancellation_reason"] as String,
      preparedDate: json["prepared_date"] as String?,
      deliveredDate: json["delivered_date"] as String?,
      canceledDate: json["canceled_date"] as String?,
      user: User.fromJson(json["user_id"] as Map<String, dynamic>),
      courier: json["courier_id"] != null
          ? Courier.fromJson(json["courier_id"] as Map<String, dynamic>)
          : null,
      orderAddress: OrderAddress.fromJson(json["order_address"] as Map<String, dynamic>),
      createdDate: json["created_date"] as String,
      createdAt: json["createdAt"] as String,
      updatedAt: json["updatedAt"] as String,
    );
  }
}

class OrderProduct {
  final Product product;
  final double quantity;
  final int salePrice;

  OrderProduct({
    required this.product,
    required this.quantity,
    required this.salePrice,
  });

  factory OrderProduct.fromJson(Map<String, dynamic> json) {
    return OrderProduct(
      product: Product.fromJson(json["product_id"] as Map<String, dynamic>),
      quantity: (json["quantity"] as num).toDouble(),
      salePrice: json["sale_price"] as int,
    );
  }
}

class Product {
  final String id;
  final String productName;
  final String unit;
  final String unitDescription;
  final int expiration;
  final List<String> additionals;
  final int sellingPrice;
  final int totalStock;
  final String imageUrl;
  final String productDescription;
  final String productIngredients;
  final NutritionalValue? nutritionalValue;

  Product({
    required this.id,
    required this.productName,
    required this.unit,
    required this.unitDescription,
    required this.expiration,
    required this.additionals,
    required this.sellingPrice,
    required this.totalStock,
    required this.imageUrl,
    required this.productDescription,
    required this.productIngredients,
    this.nutritionalValue,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    final imageLog = json["image_log"] as List<dynamic>;
    final mainImage = imageLog.firstWhere(
          (image) => image["isMain"] == true,
      orElse: () => {"image_url": ""},
    );
    return Product(
      id: json["_id"] as String,
      productName: json["product_name"] as String,
      unit: json["unit"] as String,
      unitDescription: json["unit_description"] as String,
      expiration: json["expiration"] as int,
      additionals: List<String>.from(json["additionals"] ?? []),
      sellingPrice: json["selling_price"] as int,
      totalStock: json["total_stock"] as int,
      imageUrl: mainImage["image_url"] as String,
      productDescription: json["product_description"] as String,
      productIngredients: json["product_ingredients"] as String,
      nutritionalValue: json["nutritional_value"] != null
          ? NutritionalValue.fromJson(json["nutritional_value"] as Map<String, dynamic>)
          : null,
    );
  }
}

class NutritionalValue {
  final double kkal;
  final double fat;
  final double protein;
  final double uglevod;

  NutritionalValue({
    required this.kkal,
    required this.fat,
    required this.protein,
    required this.uglevod,
  });

  factory NutritionalValue.fromJson(Map<String, dynamic> json) {
    return NutritionalValue(
      kkal: (json["kkal"] as num).toDouble(),
      fat: (json["fat"] as num).toDouble(),
      protein: (json["protein"] as num).toDouble(),
      uglevod: (json["uglevod"] as num).toDouble(),
    );
  }
}

class OrderAddress {
  final double lat;
  final double long;
  final String id;

  OrderAddress({
    required this.lat,
    required this.long,
    required this.id,
  });

  factory OrderAddress.fromJson(Map<String, dynamic> json) {
    return OrderAddress(
      lat: (json["lat"] as num).toDouble(),
      long: (json["long"] as num).toDouble(),
      id: json["_id"] as String,
    );
  }
}

class User {
  final String id;
  final String userName;
  final String userPhone;
  final String userGender;
  final String telegramId;

  User({
    required this.id,
    required this.userName,
    required this.userPhone,
    required this.userGender,
    required this.telegramId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["_id"] as String,
      userName: json["user_name"] as String,
      userPhone: json["user_phone"] as String,
      userGender: json["user_gender"] as String,
      telegramId: json["telegram_id"] as String,
    );
  }
}

class Courier {
  final String id;
  final String courierName;
  final String courierPhone;
  final String courierGender;

  Courier({
    required this.id,
    required this.courierName,
    required this.courierPhone,
    required this.courierGender,
  });

  factory Courier.fromJson(Map<String, dynamic> json) {
    return Courier(
      id: json["_id"] as String,
      courierName: json["courier_name"] as String,
      courierPhone: json["courier_phone"] as String,
      courierGender: json["courier_gender"] as String,
    );
  }
}