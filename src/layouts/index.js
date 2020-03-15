import styles from './index.less';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>股权架构图 demo</h1>
      {props.children}
    </div>
  );
}

export default BasicLayout;
