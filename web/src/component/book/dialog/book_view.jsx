import React from "react";
import { Tag, Avatar } from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { t } from "ttag";
import moment from "moment";
import BookItemForm from "../book_item/form";
import { languages } from "../config";
import styles from "./book_view.module.css";

const formatLanguage = (item) => {
  let result = "Tiếng Việt";
  for (let i = 0; i < languages.length; i++) {
    if (item == languages[i].value) {
      result = languages[i].label;
    }
  }
  return result;
};

export const Author = ({ book }) =>
  book.authors ? (
    React.Children.toArray(
      book.authors.map((author, index) =>
        index == book.authors.length - 1 ? (
          <span className={styles.book_author_name}>{author.name}</span>
        ) : (
          <span className={styles.book_author_name}>{`${author.name}, `}</span>
        )
      )
    )
  ) : (
    <span></span>
  );

export const CategoryTag = ({ book }) =>
  book.categories ? (
    React.Children.toArray(
      book.categories.map((item, index) => (
        <Tag color="blue" key={index} style={{ margin: "2px 0" }}>
          {item.title}
        </Tag>
      ))
    )
  ) : (
    <span></span>
  );

export default function BookView({ book }) {
  // console.log(book);
  return (
    <div className={styles.container}>
      <div className={styles.content_container}>
        {book.thumbnail ? (
          <img src={book.thumbnail} className={styles.book_image} />
        ) : (
          <Avatar
            shape="square"
            size={200}
            style={{ marginRight: "24px" }}
            icon={<BookOutlined />}
          />
        )}

        <div className={styles.book_content}>
          <div className={styles.book_title}>{book.title}</div>
          <div className={styles.book_content_row}>
            <span className={styles.book_author_title}>{t`Author`}: </span>
            <Author book={book} />
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_publish_name}>{book.publisher}</span>
            <span className={styles.book_language}>
              {moment(book.publication_date).format("DD-MM-YYYY HH:mm:ss")}
            </span>
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_category_title}>{t`Category`}: </span>
            <CategoryTag book={book} />
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_author_title}>{t`Language`}: </span>
            <span>{formatLanguage(book.language)}</span>
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_author_title}>{t`Price`}: </span>
            <span>{`${book.price.toLocaleString("en")} VNĐ`}</span>
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_author_title}>{t`Quantity`}: </span>
            <span>{`${book.total_available_book_items} / ${book.total_book_items}`}</span>
          </div>
          <div className={styles.book_content_row}>
            <span className={styles.book_author_title}>Có thể mượn: </span>
            <span>
              {book.is_available ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )}
            </span>
          </div>
          {book.file ? (
            <div className={styles.book_content_row}>
              <span className={styles.book_author_title}>{t`File`}: </span>
              <a href={book.file} target="_blank" rel="noopener noreferrer">
                {book.file}
              </a>
            </div>
          ) : (
            <span></span>
          )}
          <div className={styles.book_description}>
            <span>{book.description}</span>
          </div>
          <div className={styles.book_item_container}>
            <BookItemForm book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}
