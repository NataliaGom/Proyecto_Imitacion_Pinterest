import { useState } from 'react';
import DeletePostModal from './components/DeletePostModal.jsx';
import DiscoverySection from './components/DiscoverySection.jsx';
import EditPostModal from './components/EditPostModal.jsx';
import Navbar from './components/Navbar.jsx';
import Pagination from './components/Pagination.jsx';
import PinGrid from './components/PinGrid.jsx';
import PostDetailModal from './components/PostDetailModal.jsx';
import PostForm from './components/PostForm.jsx';
import UserForm from './components/UserForm.jsx';
import { useCurrentUser } from './hooks/useCurrentUser.js';
import { usePosts } from './hooks/usePosts.js';

export default function App() {
  const { currentUser, saveUser, clearUser } = useCurrentUser();
  const postsApi = usePosts(currentUser);
  const [detailState, setDetailState] = useState({ post: null, loading: false, error: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  async function openDetail(postId) {
    setDetailState({ post: null, loading: true, error: '' });
    try {
      const post = await postsApi.getPost(postId);
      setDetailState({ post, loading: false, error: '' });
    } catch (error) {
      setDetailState({ post: null, loading: false, error: error.message });
    }
  }

  function closeDetail() {
    setDetailState({ post: null, loading: false, error: '' });
  }

  function handlePageSizeChange(size) {
    postsApi.setPageSize(size);
    postsApi.setPage(1);
  }

  function openEdit(post) {
    closeDetail();
    setEditingPost(post);
  }

  function openDelete(post) {
    closeDetail();
    setDeletingPost(post);
  }

  return (
    <>
      <Navbar currentUser={currentUser} onClearUser={clearUser} />
      <main id="top" className="container-fluid px-3 px-lg-5 py-4 py-lg-5">
        <UserForm currentUser={currentUser} onSaveUser={saveUser} />
        {currentUser ? (
          <>
            <PostForm currentUser={currentUser} onSubmit={postsApi.createPost} />
            <PinGrid posts={postsApi.posts} loading={postsApi.loading} error={postsApi.error} onDetail={openDetail} onEdit={openEdit} onDelete={openDelete} />
            <Pagination pagination={postsApi.pagination} page={postsApi.page} pageSize={postsApi.pageSize} onPageChange={postsApi.setPage} onPageSizeChange={handlePageSizeChange} />
            <DiscoverySection currentUser={currentUser} onSavePhoto={postsApi.createPost} />
          </>
        ) : (
          <div className="alert alert-light border rounded-4">Guarda un usuario para cargar el feed, crear pins y usar la sección de descubrimiento.</div>
        )}
      </main>
      <PostDetailModal post={detailState.post} loading={detailState.loading} error={detailState.error} onClose={closeDetail} onEdit={openEdit} onDelete={openDelete} />
      <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onPatch={postsApi.patchPost} onReplace={postsApi.replacePost} />
      <DeletePostModal post={deletingPost} onClose={() => setDeletingPost(null)} onConfirm={postsApi.deletePost} />
    </>
  );
}
