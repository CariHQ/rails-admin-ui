import { useAdminLogin } from "medusa-react";
import { useForm, UseFormSetError } from "react-hook-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useWidgets } from "../../../providers/widget-provider";
import { useTranslation } from "react-i18next";
import InputError from "../../atoms/input-error";
import WidgetContainer from "../../extensions/widget-container";
import Button from "../../fundamentals/button";
import SigninInput from "../../molecules/input-signin";
import { useEffect, useRef, useState } from "react";
import { boolean } from "zod";
import { UseMutateFunction } from "@tanstack/react-query";

type FormValues = {
	email: string;
	password: string;
	matchpassword: string;
};
type SubmitFormValues = {
	email: string;
	password: string;
};

type LoginCardProps = {
	toResetPassword: () => void;
};

const useSign = (
	props: FormValues,
	setError: UseFormSetError<FormValues>,
	setisLoading: Function,
	navigate: NavigateFunction,
	mutate: Function
) => {
	const submitForm: SubmitFormValues = {
		email: props.email,
		password: props.password,
	};
	console.log(submitForm);
	if (props.matchpassword !== props.password) {
		setisLoading(false);
		return setError(
			"password",
			{
				type: "invalid_data",
				message: "password unmatched",
			},
			{
				shouldFocus: true,
			}
		);
	}

	fetch("http://localhost:9000/auth/signup", {
		mode: "cors",
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(submitForm),
	}).then((res) => {
		setisLoading(false);
		if (res.status !== 201) {
			return setError(
				"password",
				{
					type: "invalid_data",
					message: "A user with the same email already exists.",
				},
				{
					shouldFocus: true,
				}
			);
		}
		mutate(submitForm, {
			onSuccess: () => {
				navigate("/a/orders");
			},
		});
		return;
	});
};

const SignUp = ({ toResetPassword }: LoginCardProps) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormValues>();

	const matchpassword = useRef();
	const { mutate } = useAdminLogin();
	const navigate = useNavigate();
	const [isLoading, setisLoading] = useState(false);

	const { t } = useTranslation();

	const { getWidgets } = useWidgets();

	const onSubmit = async (values: FormValues) => {
		setisLoading(true);
		await useSign(values, setError, setisLoading, navigate, mutate);
	};

	return (
		<div className="gap-y-large flex flex-col">
			{getWidgets("login.before").map((w, i) => {
				return (
					<WidgetContainer
						key={i}
						widget={w}
						injectionZone="login.before"
						entity={undefined}
					/>
				);
			})}
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col items-center">
					<h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
						{"signUp to railsAfrica"}
					</h1>
					<div>
						<SigninInput
							placeholder={t("login-card-email", "Email")}
							{...register("email", { required: true })}
							autoComplete="email"
							className="mb-small"
						/>
						<SigninInput
							placeholder={t("login-card-password", "Password")}
							type={"password"}
							{...register("password", { required: true })}
							className="mb-xsmall"
						/>
						<SigninInput
							placeholder={"matchpassword"}
							type={"password"}
							{...register("matchpassword", { required: true })}
							className="mb-xsmall"
						/>
						<InputError errors={errors} name="password" />
					</div>
					<Button
						className="rounded-rounded inter-base-regular mt-4 w-[280px]"
						variant="secondary"
						size="medium"
						type="submit"
						loading={isLoading}
					>
						Continue
					</Button>
					<span className="inter-small-regular text-grey-50 mt-8 cursor-none">
						OR
					</span>
					<Button
						className="rounded-rounded inter-base-regular mt-4 w-[280px]"
						variant="secondary"
						size="medium"
						onClick={() => {
							navigate("/login");
						}}
					>
						Back to Login
					</Button>
				</div>
			</form>
			{getWidgets("login.after").map((w, i) => {
				return (
					<WidgetContainer
						key={i}
						widget={w}
						injectionZone="login.after"
						entity={undefined}
					/>
				);
			})}
		</div>
	);
};

export default SignUp;
