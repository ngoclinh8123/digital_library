import { Link } from "react-router-dom";
import { Avatar, List, Row, Col, Divider } from "antd";
import styles from "./book_detail.module.css";

export default function BookSuggest({ list_books }) {
  const Book = ({ book }) => {
    return (
      <Link to={book.id} className={styles.book_sg_item}>
        <img src={book.thumbnail} className={styles.book_sg_image} />
        <div className={styles.book_sg_item_content}>
          <div className={styles.book_sg_title}>{book.title}</div>
          <div className={styles.book_publish}>
            <span className={styles.book_publish_title}>Xuất bản: </span>
            <span className={styles.book_publish_name}>{book.publisher}</span>
            <span className={styles.book_language}>
              {book.publication_date}
            </span>
          </div>
        </div>
      </Link>
    );
  };
  return (
    <div className={styles.book_sg_container}>
      <div className={styles.book_sg_header}>Sách cùng tác giả</div>
      <Divider />
      {list_books.map((book) => (
        <Book book={book} />
      ))}
    </div>
  );
}
