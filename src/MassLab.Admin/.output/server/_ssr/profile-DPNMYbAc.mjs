import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { r as cn, t as Button } from "./button-BPK1zgJN.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { t as Separator } from "./separator-DDlQh6CO.mjs";
import { N as Copy, O as Eye, T as KeyRound, U as Camera, _ as RefreshCw, b as Mail, f as ShieldCheck, k as EyeOff } from "../_libs/lucide-react.mjs";
import { r as ROLES } from "./mock-data-C6f75jgQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { a as initials } from "./app-sidebar-DWLue5Me.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-cKdyAgSG.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DPNMYbAc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function AvatarDialog({ open, onClose, currentInitials, avatarSrc, onSave }) {
	const { t } = useI18n();
	const fileRef = (0, import_react.useRef)(null);
	const [preview, setPreview] = (0, import_react.useState)(avatarSrc);
	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => setPreview(ev.target?.result);
		reader.readAsDataURL(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.avatarTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.avatarDesc") })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card shadow-card",
							children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview,
								alt: "avatar",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full w-full place-items-center rounded-xl bg-gradient-brand text-2xl font-bold text-primary-foreground",
								children: currentInitials
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1.5 h-3.5 w-3.5" }), t("profile.avatarUpload")]
							}), preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setPreview(null),
								children: t("profile.avatarRemove")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: handleFile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: t("profile.avatarHint")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: t("common.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-brand text-primary-foreground hover:opacity-90",
					onClick: () => {
						onSave(preview);
						toast.success(t("profile.avatarSaved"));
						onClose();
					},
					children: t("common.save")
				})] })
			]
		})
	});
}
function ChangePasswordDialog({ open, onClose }) {
	const { t } = useI18n();
	const [showCurrent, setShowCurrent] = (0, import_react.useState)(false);
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function handleSave() {
		setError("");
		if (!current) {
			setError(t("profile.pwErrCurrent"));
			return;
		}
		if (next.length < 8) {
			setError(t("profile.pwErrLength"));
			return;
		}
		if (next !== confirm) {
			setError(t("profile.pwErrMatch"));
			return;
		}
		toast.success(t("profile.pwChanged"));
		setCurrent("");
		setNext("");
		setConfirm("");
		onClose();
	}
	function handleClose() {
		setCurrent("");
		setNext("");
		setConfirm("");
		setError("");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.pwTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.pwDesc") })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwField, {
							label: t("profile.pwCurrent"),
							value: current,
							onChange: setCurrent,
							show: showCurrent,
							onToggle: () => setShowCurrent(!showCurrent)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwField, {
							label: t("profile.pwNew"),
							value: next,
							onChange: setNext,
							show: showNew,
							onToggle: () => setShowNew(!showNew)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwField, {
							label: t("profile.pwConfirm"),
							value: confirm,
							onChange: setConfirm,
							show: showConfirm,
							onToggle: () => setShowConfirm(!showConfirm)
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: t("profile.pwHint")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: handleClose,
					children: t("common.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-brand text-primary-foreground hover:opacity-90",
					onClick: handleSave,
					children: t("profile.pwSave")
				})] })
			]
		})
	});
}
function PwField({ label, value, onChange, show, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: show ? "text" : "password",
				value,
				onChange: (e) => onChange(e.target.value),
				className: "pr-9"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onToggle,
				className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
				children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
			})]
		})]
	});
}
var MOCK_BACKUP_CODES = [
	"A1B2-C3D4",
	"E5F6-G7H8",
	"I9J0-K1L2",
	"M3N4-O5P6",
	"Q7R8-S9T0",
	"U1V2-W3X4"
];
var MOCK_QR = "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/MassLab:admin@masslab.io?secret=JBSWY3DPEHPK3PXP&issuer=MassLab";
function TwoFADialog({ open, onClose, enabled, onToggle }) {
	const { t } = useI18n();
	const [step, setStep] = (0, import_react.useState)("overview");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [otpError, setOtpError] = (0, import_react.useState)("");
	function handleClose() {
		setStep("overview");
		setOtp("");
		setOtpError("");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			children: [
				step === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.tfaTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.tfaDesc") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: t("profile.tfaApp")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: t("profile.tfaAppSub")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: enabled,
								onCheckedChange: (v) => {
									if (v) setStep("setup");
									else setStep("disable");
								}
							})]
						}), enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-full",
							size: "sm",
							onClick: () => setStep("codes"),
							children: t("profile.tfaViewCodes")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: handleClose,
						children: t("common.close")
					}) })
				] }),
				step === "setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.tfaSetupTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.tfaSetupDesc") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: MOCK_QR,
							alt: "QR code",
							className: "rounded-lg border border-border",
							width: 160,
							height: 160
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("profile.tfaOtpLabel") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "000 000",
									value: otp,
									onChange: (e) => setOtp(e.target.value),
									maxLength: 7,
									className: "text-center tracking-widest text-lg"
								}),
								otpError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-destructive",
									children: otpError
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStep("overview"),
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-primary-foreground hover:opacity-90",
						onClick: () => {
							if (otp.replace(/\s/g, "").length < 6) {
								setOtpError(t("profile.tfaOtpError"));
								return;
							}
							onToggle(true);
							toast.success(t("profile.tfaEnabled"));
							setStep("overview");
							setOtp("");
							setOtpError("");
						},
						children: t("profile.tfaVerify")
					})] })
				] }),
				step === "disable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.tfaDisableTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.tfaDisableDesc") })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setStep("overview"),
					children: t("common.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "destructive",
					onClick: () => {
						onToggle(false);
						toast.success(t("profile.tfaDisabled"));
						setStep("overview");
					},
					children: t("profile.tfaDisableBtn")
				})] })] }),
				step === "codes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.tfaCodesTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.tfaCodesDesc") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 py-2",
						children: MOCK_BACKUP_CODES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								navigator.clipboard.writeText(code);
								toast.success(t("profile.tfaCopied"));
							},
							className: "flex items-center justify-between rounded border border-border px-3 py-1.5 font-mono text-sm hover:bg-accent",
							children: [
								code,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "ml-1 h-3 w-3 text-muted-foreground" })
							]
						}, code))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							navigator.clipboard.writeText(MOCK_BACKUP_CODES.join("\n"));
							toast.success(t("profile.tfaCopied"));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }), t("profile.tfaRegenerate")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStep("overview"),
						children: t("common.close")
					})] })
				] })
			]
		})
	});
}
function RecoveryEmailDialog({ open, onClose, current, onSave }) {
	const { t } = useI18n();
	const [value, setValue] = (0, import_react.useState)(current);
	const [error, setError] = (0, import_react.useState)("");
	function handleSave() {
		setError("");
		if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setError(t("profile.recoveryError"));
			return;
		}
		onSave(value);
		toast.success(t("profile.recoverySaved"));
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: () => {
			setValue(current);
			setError("");
			onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("profile.recoveryTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("profile.recoveryDesc") })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("profile.recoveryLabel") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value,
								onChange: (e) => setValue(e.target.value),
								placeholder: "recovery@example.com"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: error
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: t("profile.recoveryHint")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						setValue(current);
						setError("");
						onClose();
					},
					children: t("common.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-brand text-primary-foreground hover:opacity-90",
					onClick: handleSave,
					children: t("common.save")
				})] })
			]
		})
	});
}
function Profile() {
	const { session, user, signIn } = useAuth();
	const { t } = useI18n();
	const [avatarOpen, setAvatarOpen] = (0, import_react.useState)(false);
	const [passwordOpen, setPasswordOpen] = (0, import_react.useState)(false);
	const [tfaOpen, setTfaOpen] = (0, import_react.useState)(false);
	const [recoveryOpen, setRecoveryOpen] = (0, import_react.useState)(false);
	const [avatarSrc, setAvatarSrc] = (0, import_react.useState)(user?.avatar ?? null);
	const [tfaEnabled, setTfaEnabled] = (0, import_react.useState)(true);
	const [recoveryEmail, setRecoveryEmail] = (0, import_react.useState)("recover@masslab.io");
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight md:text-3xl",
				children: t("profile.title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("profile.subtitle")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden border-border shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 bg-gradient-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "-mt-12 flex flex-col gap-5 px-6 pb-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card shadow-card",
								children: avatarSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarSrc,
									alt: user.name,
									className: "h-full w-full object-cover rounded-xl"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-full w-full place-items-center rounded-xl bg-gradient-brand text-2xl font-bold text-primary-foreground",
									children: initials(user.name)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAvatarOpen(true),
								className: "absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-card hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-semibold",
								children: user.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground",
								children: [
									user.title,
									" · ",
									user.organization
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "font-normal",
									children: "Super Administrator"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "font-normal",
									children: t("profile.mfa")
								})]
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => toast.success(t("profile.saved")),
						className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
						children: t("profile.save")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-card lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: t("profile.account")
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.fullName"),
								defaultValue: user.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.username"),
								defaultValue: user.username
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.email"),
								defaultValue: user.email,
								type: "email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.org"),
								defaultValue: user.organization,
								disabled: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.job"),
								defaultValue: user.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profile.tz"),
								defaultValue: "Asia/Ho_Chi_Minh (GMT+7)"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: t("profile.security")
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityRow, {
								icon: KeyRound,
								title: t("profile.password"),
								sub: t("profile.passwordSub"),
								action: t("profile.change"),
								onAction: () => setPasswordOpen(true)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityRow, {
								icon: ShieldCheck,
								title: t("profile.twofa"),
								sub: t("profile.twofaSub"),
								action: t("profile.manage"),
								badge: tfaEnabled ? t("profile.on") : void 0,
								onAction: () => setTfaOpen(true)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityRow, {
								icon: Mail,
								title: t("profile.recovery"),
								sub: recoveryEmail,
								action: t("profile.update"),
								onAction: () => setRecoveryOpen(true)
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: t("profile.effective")
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-2",
					children: ROLES.slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-gradient-brand-soft px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								r.permissions.length,
								" ",
								t("users.permissions")
							]
						})]
					}, r.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarDialog, {
				open: avatarOpen,
				onClose: () => setAvatarOpen(false),
				currentInitials: initials(user.name),
				avatarSrc,
				onSave: (src) => {
					setAvatarSrc(src);
					if (session) signIn({
						...session,
						user: {
							...session.user,
							avatar: src ?? void 0
						}
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePasswordDialog, {
				open: passwordOpen,
				onClose: () => setPasswordOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TwoFADialog, {
				open: tfaOpen,
				onClose: () => setTfaOpen(false),
				enabled: tfaEnabled,
				onToggle: setTfaEnabled
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoveryEmailDialog, {
				open: recoveryOpen,
				onClose: () => setRecoveryOpen(false),
				current: recoveryEmail,
				onSave: setRecoveryEmail
			})
		]
	});
}
function Field({ label, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...rest })]
	});
}
function SecurityRow({ icon: Icon, title, sub, action, badge, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-medium",
					children: [title, badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "font-normal",
						children: badge
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-xs text-muted-foreground",
					children: sub
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onAction,
				children: action
			})
		]
	});
}
//#endregion
export { Profile as component };
