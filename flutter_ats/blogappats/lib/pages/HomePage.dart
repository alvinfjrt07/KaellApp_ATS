import 'package:flutter/material.dart';

import '../Addproduct.dart';
import '../models/article.dart';
import '../pages/DetaileProduct.dart';
import '../services/api_client.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  static List<Article> filterPostsByQuery(List<Article> source, String query) {
    final normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.isEmpty) {
      return source;
    }

    return source.where((post) {
      final title = post.title.toLowerCase();
      final content = post.content.toLowerCase();
      return title.contains(normalizedQuery) || content.contains(normalizedQuery);
    }).toList();
  }

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Article> posts = [];
  bool isLoading = true;
  String? errorMessage;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  List<Article> get filteredPosts => HomePage.filterPostsByQuery(posts, _searchQuery);

  @override
  void initState() {
    super.initState();
    getPosts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> getPosts() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final result = await ApiClient().getArticles();
      setState(() {
        posts = result;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('KaellApp'),
        actions: [
          IconButton(
            onPressed: getPosts,
            icon: const Icon(Icons.refresh_rounded),
          ),
          IconButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/LoginPage');
            },
            icon: const Icon(Icons.logout_rounded),
          ),
        ],
      ),
      body: Center(
      child: ConstrainedBox(
      constraints: const BoxConstraints(
      maxWidth: 480,
    ),
    child: RefreshIndicator(
      onRefresh: getPosts,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 100),
        children: [
            _buildHeaderCard(),
            const SizedBox(height: 20),
            const Text(
              'Artikel terbaru',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF171A3D),
              ),
            ),
            const SizedBox(height: 14),
            if (isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 36),
                  child: CircularProgressIndicator(),
                ),
              )
            else if (errorMessage != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Text(
                  errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              )
            else if (posts.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: Text(
                    'Belum ada artikel',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              )
            else if (filteredPosts.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: Text(
                    'Artikel tidak ditemukan',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              )
            else
              ...filteredPosts.map((post) => articleCard(post)),
          ],
        ),
      ),
    ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF6C63FF),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Tulis Artikel',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddProductPage()),
          );
          if (mounted) getPosts();
        },
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF171A3D), Color(0xFF2C2F6F)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Halo, Kaell 👋',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'Baca inspirasi hari ini',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
              style: const TextStyle(color: Color.fromARGB(255, 20, 20, 20)),
              decoration: const InputDecoration(
                icon: Icon(Icons.search, color: Colors.white70),
                hintText: 'Cari artikel',
                hintStyle: TextStyle(color: Color.fromARGB(179, 23, 23, 23)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget articleCard(Article post) {
    final categoryName = switch (post.categoryId) {
      1 => 'Olahraga',
      2 => 'Pendidikan',
      3 => 'Teknologi',
      _ => 'Artikel',
    };

    return InkWell(
      onTap: () async {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => DetailProductPage(article: post)),
        );
        if (result == true && mounted) {
          getPosts();
        }
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAE7FF),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    categoryName,
                    style: const TextStyle(
                      color: Color(0xFF6C63FF),
                      fontWeight: FontWeight.w700,
                      fontSize: 11,
                    ),
                  ),
                ),
                const Spacer(),
                const Icon(Icons.more_horiz_rounded, color: Colors.grey),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              post.title.isNotEmpty ? post.title : 'Tanpa Judul',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF171A3D),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              post.content,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13,
                color: Colors.grey,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: const [
                Icon(Icons.arrow_forward_rounded, size: 16, color: Color(0xFF6C63FF)),
                SizedBox(width: 6),
                Text(
                  'Baca selengkapnya',
                  style: TextStyle(
                    color: Color(0xFF6C63FF),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
