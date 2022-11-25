import AuthCheck from "../../../components/AuthCheck";
import PremiumCheck from "../../../components/PremiumCheck";

import { useRouter } from "next/router";
import { auth } from "../../../lib/firebase";
import {
  doc,
  getFirestore,
  where,
  query,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

import { useDocumentDataOnce } from "../../../lib/reactFirebaseHooks.ts";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";

export default function Email() {
  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);
  const [students, setStudents] = useState(undefined);
  const [emailList, setEmailList] = useState(undefined);

  const getStudents = async (filters) => {
    let filterParameters = [];

    if (filters.pays === false) {
      //If the program doesn't pay, then query for students that are ok with not getting paid
      filterParameters.push(where("pays_preference", "==", false));
    }
    if (filters.virtual === true) {
      //If the program is virtual, then query for students that are ok with it being virtual
      filterParameters.push(where("virtual_preference", "==", true));
    }
    if (filters.hasCost === true) {
      //If the program has a cost, then query for students that are ok with it having a cost
      filterParameters.push(where("hasCost_preference", "==", true));
    }

    const ref = collection(getFirestore(), "users");
    const studentsQuery = query(
      ref,
      where("grade_preference", "in", filters.grade),
      where("subject_preference", "array-contains", filters.subject),
      ...filterParameters,
      where("email_preference", "==", true)
    );

    const students = (await getDocs(studentsQuery)).docs.map((doc) =>
      doc.data()
    );

    let final = [];
    let emails = [];

    students.forEach((student) => {
      if (filters.type.includes(student.type_preference)) {
        final.push(student);
        emails.push(student.email);
      }
    });

    setStudents(final);
    setEmailList(emails);
  };

  const [useTitle, setUseTitle] = useState(false);
  const [useHeader, setUseHeader] = useState(false);

  function EmailForm() {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
    const onSubmit = (emailContent) => sendEmails(emailContent);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          defaultValue="Subject"
          {...register("subject", { required: true })}
        />

        <fieldset>
          <input
            type="checkbox"
            defaultChecked={false}
            onClick={() => {
              setUseTitle(!useTitle);
            }}
          />
          <label>Use Title</label>
        </fieldset>
        <input
          disabled={!useTitle}
          defaultValue="title"
          {...register("title", { required: useTitle })}
        />

        <fieldset>
          <input
            type="checkbox"
            defaultChecked={false}
            onClick={() => {
              setUseHeader(!useHeader);
            }}
          />
          <label>Use Header</label>
        </fieldset>
        <input
          disabled={!useHeader}
          defaultValue="header"
          {...register("header", { required: useHeader })}
        />

        {emailList !== undefined ? (
          <input type="submit" />
        ) : (
          <h2>Please count students before sending</h2>
        )}
      </form>
    );
  }

  const sendEmails = (emailContent) => {
    emailList.forEach(async (email) => {
      await addDoc(collection(getFirestore(), "mail"), {
        to: email,
        message: {
          subject: emailContent.subject,
          html: `<head>
          <title></title>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
          <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <style>
              * {
                box-sizing: border-box;
              }
          
              body {
                margin: 0;
                padding: 0;
              }
          
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
              }
          
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
              }
          
              p {
                line-height: inherit
              }
          
              .desktop_hide,
              .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
              }
          
              .menu_block.desktop_hide .menu-links span {
                mso-hide: all;
              }
          
              @media (max-width:700px) {
          
                .desktop_hide table.icons-inner,
                .social_block.desktop_hide .social-table {
                  display: inline-block !important;
                }
          
                .icons-inner {
                  text-align: center;
                }
          
                .icons-inner td {
                  margin: 0 auto;
                }
          
                .row-content {
                  width: 100% !important;
                }
          
                .mobile_hide {
                  display: none;
                }
          
                .stack .column {
                  width: 100%;
                  display: block;
                }
          
                .mobile_hide {
                  min-height: 0;
                  max-height: 0;
                  max-width: 0;
                  overflow: hidden;
                  font-size: 0px;
                }
          
                .desktop_hide,
                .desktop_hide table {
                  display: table !important;
                  max-height: none !important;
                }
          
                .row-2 .column-1 .block-2.paragraph_block td.pad>div,
                .row-3 .column-2 .block-3.paragraph_block td.pad>div {
                  font-size: 48px !important;
                }
          
                .row-4 .column-1 .block-2.image_block td.pad {
                  padding: 0 20px 30px !important;
                }
          
                .row-3 .column-2 .block-3.paragraph_block td.pad {
                  padding: 0 !important;
                }
              }
            </style>
          </head>
          <body style="background-color: #0d4e65; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0d4e65;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #08313f; color: #000000; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
          <div class="spacer_block" style="height:30px;line-height:30px;font-size:1px;"> </div>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #08313f; border-radius: 0; color: #000000; background-image: url('images/hero-image-20.png'); background-position: top center; background-repeat: no-repeat; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
          <tr>
          <td class="pad" style="padding-top:60px;padding-bottom:250px;">
          <div style="color:#ffffff;direction:ltr;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;font-size:70px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:84px;">
          ${useTitle ? `<p style="margin: 0;">${emailContent.title}</p>` : ""}
          </div>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #08313f; border-radius: 0; color: #000000; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="16.666666666666668%">
          <div class="spacer_block" style="height:1px;line-height:0px;font-size:1px;"> </div>
          </td>
          <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
          <tr>
          <td class="pad" style="padding-top:50px;">
          <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:48px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:57.599999999999994px;">
          ${useHeader ? `<p style="margin: 0;">${emailContent.header}</p>` : ""}
          </div>
          </td>
          </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad" style="padding-bottom:70px;padding-left:10px;padding-right:10px;padding-top:10px;">
          <div align="center" class="alignment">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="30%">
          <tr>
          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 5px solid #EB9903;"><span> </span></td>
          </tr>
          </table>
          </div>
          </td>
          </tr>
          </table>
          </td>
          <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="16.666666666666668%">
          <div class="spacer_block" style="height:1px;line-height:0px;font-size:1px;"> </div>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #08313f; border-radius: 0; color: #000000; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad" style="padding-left:20px;padding-right:20px;width:100%;">
          <div align="center" class="alignment" style="line-height:10px"><img alt="About Image" src="images/about-image-10.png" style="display: block; height: auto; border: 0; width: 300px; max-width: 100%;" title="About Image" width="300"/></div>
          </td>
          </tr>
          </table>
          </td>
          <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
          <tr>
          <td class="pad" style="padding-bottom:30px;padding-left:20px;padding-right:20px;">
          <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:20px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:24px;">
          <p style="margin: 0;">Our History</p>
          </div>
          </td>
          </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
          <tr>
          <td class="pad" style="padding-bottom:30px;padding-left:20px;padding-right:20px;">
          <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
          <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor accumsan, consectetur tortor dolor arcu. Pellentesque volutpat nulla nunc enim Laoreet maecenas cursus suscipit. <br/><br/>Viverra et, et elit auctor tristique purus, luctus. Neque aenean scelerisque varius commodo odio quis sagittis, interdum ultricies. Viverra eget pharetra fermentum, sagittis, nunc neque feugiat.</p>
          </div>
          </td>
          </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" class="button_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad" style="padding-bottom:40px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
          <div align="center" class="alignment">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://www.example.com" style="height:35px;width:157px;v-text-anchor:middle;" arcsize="9%" stroke="false" fillcolor="#eb9903"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px"><![endif]--><a href="http://www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#eb9903;border-radius:3px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:30px;padding-right:30px;font-size:14px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 25.2px;">READ MORE  ⟩</span></span></a>
          <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
          </div>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #08313f; color: #000000; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
          <table border="0" cellpadding="10" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad">
          <div align="center" class="alignment">
          <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="108px">
          <tr>
          <td style="padding:0 2px 0 2px;"><a href="http://www.example.com" target="_blank"><img alt="Facebook" height="32" src="images/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
          <td style="padding:0 2px 0 2px;"><a href="http://www.example.com" target="_blank"><img alt="Twitter" height="32" src="images/twitter2x.png" style="display: block; height: auto; border: 0;" title="twitter" width="32"/></a></td>
          <td style="padding:0 2px 0 2px;"><a href="http://www.example.com" target="_blank"><img alt="Instagram" height="32" src="images/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
          </tr>
          </table>
          </div>
          </td>
          </tr>
          </table>
          <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
          <tr>
          <td class="pad">
          <div style="font-family: sans-serif">
          <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #d0d0d0; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">Your Street 12, 34567 AB City  /  info@example.com / (+1) 123 456 789</span></p>
          </div>
          </div>
          </td>
          </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" class="menu_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad" style="color:#cccccc;font-family:inherit;font-size:12px;padding-bottom:10px;text-align:center;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="alignment" style="text-align:center;font-size:0px;">
          <div class="menu-links">
          <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style=""><tr style="text-align:center;"><![endif]-->
          <!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="http://www.example.com" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#cccccc;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;text-decoration:none;letter-spacing:normal;">Unsubscribe</a>
          <!--[if mso]></td><td><![endif]--><span class="sep" style="font-size:12px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;color:#cccccc;">|</span>
          <!--[if mso]></td><![endif]-->
          <!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="http://www.example.com" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#cccccc;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;text-decoration:none;letter-spacing:normal;">Manage Preferences</a>
          <!--[if mso]></td><![endif]-->
          <!--[if mso]></tr></table><![endif]-->
          </div>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
          <tbody>
          <tr>
          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
          <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
          <tr>
          <td class="alignment" style="vertical-align: middle; text-align: center;">
          <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
          <!--[if !vml]><!-->
          <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
          <!--<![endif]-->
          </table>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table><!-- End -->
          </body>
          </html>`,
        },
      });
    });
    toast.success("Emails Sent!");
  };

  useEffect(() => {
    console.log(students);
  }, [students]);

  return (
    <AuthCheck>
      <PremiumCheck>
        <>
          <button
            onClick={() => {
              getStudents(post);
            }}
          >
            count students
          </button>
          {students ? students.length : 0}
          {EmailForm()}
        </>
      </PremiumCheck>
    </AuthCheck>
  );
}
