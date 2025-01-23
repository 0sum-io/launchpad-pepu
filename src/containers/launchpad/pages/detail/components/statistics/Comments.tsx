import React, { useState } from "react";
import styled from "@emotion/styled";
import { hoverableStyle } from "utils/style";
import { selectImageFile } from "utils/selectImageFile";
import { colors } from "@boxfoxs/bds-common";
import { useCreatePresaleState } from "containers/launchpad/pages/create/hooks/useCreateStore";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";

export function Comments({ data }: { data: ParsedPresale }) {
  const form = useCreatePresaleState();
  const [icon, setIcon] =
    React.useState<Awaited<ReturnType<typeof selectImageFile>>>();

  const [commentsList] = useState([
    {
      commentator: "C54G...84Bf",
      timestamp: "5:17:05 PM",
      comment: "Random comment here...",
      comment_image_url: "",
      likes: 3,
      replies: [],
    },
  ]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handlePostReply = () => {
    if (newComment.trim()) {
      // Logic for posting the reply (e.g., update state or call an API)
      console.log("Comment:", newComment);
      console.log("Image File:", imageFile);
      setDialogOpen(false);
      setNewComment("");
      setImageFile(null);
    }
  };

  return (
    <Container>
      <Header>
        <PostReplyButton onClick={() => setDialogOpen(true)}>Post a Reply</PostReplyButton>
        <SortSelect>
          <option>sort: time (asc)</option>
          <option>sort: time (desc)</option>
        </SortSelect>
      </Header>

      <CommentsList>
        {commentsList.map((comment, index) => (
          <Comment key={index}>
            <CommentHeader>
              <Commentator>
                <Avatar src="/images/comment_avatar.svg" alt="avatar" />
                  {comment.commentator}
                <Timestamp>{comment.timestamp}</Timestamp>
              </Commentator>
              <ReplyButton>Reply</ReplyButton>
            </CommentHeader>
            <CommentText>{comment.comment}</CommentText>
          </Comment>
        ))}
      </CommentsList>

      {isDialogOpen && (
        <DialogOverlay>
          <Dialog>
            <CloseButton onClick={() => {
              setDialogOpen(false);
              setIcon(null);
            }}>&times;</CloseButton>
            <h3 style={{ fontSize: "16px", fontWeight: "700", textAlign: "left" }}>ADD A COMMENT</h3>
            <TextAreaSpace
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Your comment..."
            ></TextAreaSpace>
            <FileUploadContainer>
              <label htmlFor="file-upload" style={{ fontSize: "16px", fontWeight: "700", textAlign: "left" }}>IMAGE (OPTIONAL)</label>
              <UploadButton
                  onClick={() => selectImageFile().then(setIcon)}
                  error={form.error.icon}
                >
                  <img src="/images/ic_document.svg" alt="upload" width={20} />
                  <span>{icon ? icon.name : "drag and drop or click the button to upload an image"}</span>

                <FakeStyledButton> Select File </FakeStyledButton>
              </UploadButton>
            </FileUploadContainer>
            <PostReplyDialogButton onClick={handlePostReply}>Post a Reply</PostReplyDialogButton>
          </Dialog>
        </DialogOverlay>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  padding: 16px;
  font-family: Grandstander;
  background-color: #121212;
  color: #fff;
  max-width: 600px;
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PostReplyButton = styled.button`
  background-color: #00d265;
  color: #000;
  font-weight: bold;
  font-size: 13px;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  width: 170px;
  height: 32px;
  margin-top: 20px;

  &:hover {
    background-color: #00b254;
  }
`;

const SortSelect = styled.select`
  background-color: #222;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 140px;
  height: 32px;

  option {
    background-color: #121212;
    color: #fff;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Comment = styled.div`
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid #3B3B3B;
  border-radius: 8px;
  background-color: #1e1e1e;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Commentator = styled.span`
  color: #00d265;
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #aaa;
  margin-left: 8px;
`;

const ReplyButton = styled.button`
  background: none;
  color: #00d265;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentText = styled.p`
  margin: 8px 0;
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #1e1e1e;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  height: 420px;
  position: relative;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const TextAreaSpace = styled.textarea`
  font-family: 'Grandstander';
  margin-top: 20px;
  padding-top: 10px;
  padding-left: 10px;
  width: 100%;
  height: 90px;
  border-radius: 16px;
  background: #272727;
  border: 2.65px solid #3B3B3B;
  color: #ffffff99;
  font-size: 16px;

  &::placeholder {
    color: #ffffff99;  
  }
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  label {
    margin-bottom: 8px;
    font-weight: bold;
  }
`;

const UploadButton = styled.button<{ error?: boolean | string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  height: 150px;
  border-radius: 16px;
  background: #272727;
  color: #62626d;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  width: 100%;
  border: 2px solid #393939;
  color: rgba(255, 255, 255, 0.6);
  border: 2px solid ${(p) => (p.error ? colors.red500 : `border: 2px solid #393939`)};
  span {
    padding-top: 18px;
    font-size: 16px;
  }
`;

const FakeStyledButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border-radius: 100%;
  font-weight: 700;
  font-size: 14px;
  padding: 16px 18px;
  width: 115px;
  text-wrap: nowrap;
  background: #000;
  border: 2px solid #2eb335;
  color: #FFF;
  margin-left: auto;
  margin-right: auto;
  top: 10px;
  ${hoverableStyle.scale(1.02)};

  border-radius: 32px;
`;

const PostReplyDialogButton = styled.button`
  background-color: #2EB335;
  color: #000;
  font-weight: 700;
  font-size: 16px;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  height: 42px;
  margin-top: 20px;

  &:hover {
    background-color: #00b254;
  }
`;