import 'package:blogappats/Edit_Product.dart';
import 'package:blogappats/models/article.dart';
import 'package:blogappats/pages/HomePage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Edit product form shows prefilled values and save button',
      (WidgetTester tester) async {
    final product = {
      'id': 1,
      'title': 'Laptop ASUS',
      'price': 15000000.0,
      'description': 'Laptop gaming',
      'category': 'electronics',
    };

    await tester.pumpWidget(
      MaterialApp(
        home: EditProductPage(product: product),
      ),
    );

    expect(find.text('Edit Produk'), findsOneWidget);
    expect(find.text('Laptop ASUS'), findsOneWidget);
    expect(find.text('15000000.0'), findsOneWidget);
    expect(find.text('Laptop gaming'), findsOneWidget);
    expect(find.text('Simpan Perubahan'), findsOneWidget);
  });

  test('search filter matches title and content and ignores empty queries', () {
    final posts = [
      Article(
        id: 1,
        title: 'Belajar Flutter',
        content: 'Panduan lengkap untuk pemula Flutter.',
        categoryId: 3,
      ),
      Article(
        id: 2,
        title: 'Tips SEO',
        content: 'Cara naikkan trafik organik.',
        categoryId: 2,
      ),
    ];

    expect(HomePage.filterPostsByQuery(posts, 'flutter').length, 1);
    expect(HomePage.filterPostsByQuery(posts, 'trafik')[0].title, 'Tips SEO');
    expect(HomePage.filterPostsByQuery(posts, '   ').length, 2);
  });
}
