import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import styles from './Modal.module.scss';

export default ({
  open,
  setOpen,
  content,
  header,
  headerIcon,
  triggerElement,
}) => {
  return (
    <Modal
      basic
      dimmer="blurring"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="tiny"
      trigger={triggerElement}
    >
      <Header icon>
        {headerIcon && <Icon name={headerIcon} />}
        <div className={styles.header}>{header} </div>
      </Header>
      <Modal.Content className={styles.content}>{content}</Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={() => setOpen(false)}>
          <Icon name="checkmark" /> Okay
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
