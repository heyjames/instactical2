import Form from './form';
import Joi from 'joi-browser';

class PlayerProfileUtils extends Form {
  classifications = [
    { type: "admin", label: "Admin", code: "00", css: { backgroundColor: "#8000ff" } },
    { type: "mod", label: "Moderator", code: "01", css: { backgroundColor: "#0070ff" } },
    { type: "regular", label: "Regular", code: "02", css: { backgroundColor: "#00ce16" } },
    { type: "moderatelyCompliant", label: "Moderately Compliant", code: "03", css: { backgroundColor: "#00ce16", border: "2px solid #000000" } },
    { type: "kickedButReformed", label: "Kicked but Reformed", code: "04", css: { backgroundColor: "#00ce16", border: "3px solid #ff7800" } },
    { type: "uncategorized", label: "Uncategorized", code: "05", css: { backgroundColor: "#000000" } },
    { type: "concern", label: "Concern", code: "06", css: { backgroundColor: "#c37c7c" } }, // ffaaaa
    { type: "kicked", label: "Kicked", code: "07", css: { backgroundColor: "#ff7800" } },
    { type: "unbanned", label: "Unbanned", code: "08", css: { backgroundColor: "#00ce16", border: "3px dashed #ff0000" } },
    { type: "banned", label: "Banned", code: "09", css: { backgroundColor: "#ff0000" } }
  ];

  schema = {
    _id: Joi.string().min(1).max(50),
    steamId: Joi.string().min(17).max(17).required().label("Steam ID"),
    comments: Joi.string().max(350).allow("").label("Comments"),
    classification: Joi.string().max(20).allow("").label("Classification"),
    alias: Joi.string().min(1).max(350).allow("").label("Alias"),
    fullBan: Joi.boolean().label("Full Ban"),
    // kicks: Joi.array(),
    // bans: Joi.array()
  }
}

export default PlayerProfileUtils;