const { createApp, ref, onMounted } = Vue;

const App = {
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const error = ref('');

    async function fetchPosts() {
      loading.value = true;
      error.value = '';

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid posts response');
        }

        posts.value = data;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Something went wrong';
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchPosts);

    return {
      posts,
      loading,
      error,
      fetchPosts,
    };
  },
};

createApp(App).mount('#app');
