import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { hoverableStyle } from "utils/style";
import { selectImageFile } from "utils/selectImageFile";
import { colors } from "@boxfoxs/bds-common";
import { useCreatePresaleState } from "containers/launchpad/pages/create/hooks/useCreateStore";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { createClient } from '@supabase/supabase-js'
import { useAddress } from "hooks/on-chain";
import { uploadImage } from "remotes/uploadImage";
import { shortenAddress } from "utils/format";

export function Comments({ data }: { data: ParsedPresale }) {
  // Creating Supabase Client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
  const address = useAddress();

  const form = useCreatePresaleState();
  const [icon, setIcon] =
    React.useState<Awaited<ReturnType<typeof selectImageFile>>>();

  const [commentsList, setComments] = useState([]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const handlePostReply = async () => {
    if (newComment.trim()) {
      /* console.log("Posting form data: ", form);
      console.log("token_address - Presale Token:", data.token.toLocaleLowerCase());
      console.log("user_id - User Address:", address.toLocaleLowerCase());
      console.log("content - Comment:", newComment);
      console.log("image_url - Image File:", icon); */

      // Storing image icon url
      let iconUrl = null;
      let tokenAddress = data.token.toLocaleLowerCase();

      if (icon) {
        iconUrl = await uploadImage(icon.file);
      }

      // Inserting data into the comments table
      const insertData = async () => {
        const insertData = {
          token_address: tokenAddress,
          user_id: address.toLocaleLowerCase(),
          content: newComment
        }

        if (iconUrl) {
          insertData['image_url'] = iconUrl;
        }
        if (replyTo) {
          insertData['parent_id'] = replyTo;
        }

        const { data, error } = await supabase
          .from('comments')
          .insert([insertData])

        if (!error) {
          insertData['created_at'] = new Date();
          if (!replyTo) {
            setComments([insertData, ...commentsList]);
          }
        }

        setDialogOpen(false);
        setReplyTo(null);
        setNewComment("");
        setIcon(null);
      }

      insertData();
    }
  };

  const setReplyToAddress = (comment_id: Number) => {
    setReplyTo(comment_id);
  };

  useEffect(() => {
    const tokenAddress = data.token.toLocaleLowerCase();
  
    const fetchComments = async () => {
      const { data: fetchedData, error } = await supabase
        .from("comments")
        .select()
        .eq("token_address", tokenAddress)
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }
  
      // Create a map of all comments for easy access
      const commentsMap = {};
      fetchedData.forEach((item) => {
        commentsMap[item.id] = {
          id: item.id,
          user_id: item.user_id,
          created_at: item.created_at,
          content: item.content,
          image_url: item.image_url || "",
          likes: 0,
          replies: [],
        };
      });
  
      // Create the nested structure
      const structuredComments = [];
      fetchedData.forEach((item) => {
        if (item.parent_id) {
          // If it's a reply, find its parent and attach it
          if (commentsMap[item.parent_id]) {
            commentsMap[item.parent_id].replies.push(commentsMap[item.id]);
          }
        } else {
          // If it's a top-level comment, add it to the structuredComments array
          structuredComments.push(commentsMap[item.id]);
        }
      });

      setComments(structuredComments);
    };
  
    fetchComments();
  }, []);
  

  return (
    <Container>
      <Header>
        <PostReplyButton
          onClick={() => setDialogOpen(true)}
          disabled={address === undefined}
        >
          Post a Reply
        </PostReplyButton>
        <SortSelect>
          <option>sort: time (asc)</option>
          <option>sort: time (desc)</option>
        </SortSelect>
      </Header>

      {commentsList.length === 0 && (
        <p style={{ textAlign: "center", margin: "20px 0" }}>Write first comment</p>
      )}

      <CommentsList>
        {commentsList.map((comment, index) => (
          <Comment key={index}>
            <CommentHeader>
              <Commentator>
                <Avatar src="/images/comment_avatar.svg" alt="avatar" />
                  ${shortenAddress(comment.user_id)}
                <Timestamp>
                  {new Date(comment.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Timestamp>
              </Commentator>
              <ReplyButton onClick={() => {
                  setDialogOpen(true);
                  setReplyToAddress(comment.id);
                }}
                disabled={address === undefined}
              > Reply
              </ReplyButton>
            </CommentHeader>
            { comment.image_url &&
              <img
                src={comment.image_url}
                alt={comment.image_url}
                style={{ marginTop: "10px", maxWidth: "-webkit-fill-available" }}
              />
            }
            <CommentText>{comment.content}</CommentText>

              <CommentsList>
                {comment.replies.map((comment, index) => (
                  <Comment key={index} style={{ background: "#080808" }}>
                    <CommentHeader>
                      <Commentator>
                        <Avatar src="/images/comment_avatar.svg" alt="avatar" />
                          ${shortenAddress(comment.user_id)}
                        <Timestamp>
                          {new Date(comment.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Timestamp>
                      </Commentator>
                      <ReplyButton onClick={() => {
                          setDialogOpen(true);
                          setReplyToAddress(comment.id);
                        }}
                        disabled={address === undefined}
                      > Reply
                      </ReplyButton>
                    </CommentHeader>
                    { comment.image_url &&
                      <img
                        src={comment.image_url}
                        alt={comment.image_url}
                        style={{ marginTop: "10px" }}
                      />
                    }
                    <CommentText>{comment.content}</CommentText>
                  </Comment>
                ))}
              </CommentsList>

          </Comment>
        ))}
      </CommentsList>

      {isDialogOpen && (
        <DialogOverlay>
          <Dialog>
            <CloseButton onClick={() => {
              setReplyToAddress(null);
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
            <PostReplyDialogButton onClick={handlePostReply}>
              Post a Reply { replyTo && <span style={{ marginLeft: "5px" }}> to Comment </span> }
            </PostReplyDialogButton>
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

  &:hover {
    background-color: #00b254;
  }

  &:disabled {
    background-color: #3B3B3B;
    cursor: not-allowed;
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

  &:disabled {
    color: #3B3B3B;
    cursor: not-allowed;
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