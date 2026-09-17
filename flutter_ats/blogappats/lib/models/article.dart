class Article {
  Article({
    required this.id,
    required this.title,
    required this.content,
    this.categoryId,
    this.image,
    this.createdAt,
  });

  final int id;
  final int? categoryId;
  final String title;
  final String content;
  final String? image;
  final DateTime? createdAt;

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
      categoryId: int.tryParse(json['category_id']?.toString() ?? ''),
      title: json['title']?.toString() ?? '',
      content: json['content']?.toString() ?? '',
      image: json['image']?.toString(),
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'category_id': categoryId,
        'title': title,
        'content': content,
        if (image != null) 'image': image,
        if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      };
}
