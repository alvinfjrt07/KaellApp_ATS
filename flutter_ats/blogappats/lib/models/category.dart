class Category {
  Category({
    required this.id,
    required this.name,
    this.createdAt,
  });

  final int id;
  final String name;
  final DateTime? createdAt;

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
      name: json['name']?.toString() ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      };
}
