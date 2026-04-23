import React, { useState } from "react";
import z from "zod";
import { addExercise } from "../Services/ExerciseService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};
const exerciseScheme = z.object({
  nameTag: z.string().min(4, "name tag to short"),
  language: z.string().max(4, "language too long"),
  description: z.string().max(200),
  name: z.string(),
  mediaUrl: z.string(),
});
type ExerciseFormInput = z.infer<typeof exerciseScheme>;
export const ExercisePage = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormInput>({ resolver: zodResolver(exerciseScheme) });

  const handleExercisePost = (form: ExerciseFormInput) => {
    addExercise(
      form.nameTag,
      form.mediaUrl,
      form.language,
      form.name,
      form.description
    );
  };
  return (
    <div>
      <form action="" onSubmit={handleSubmit(handleExercisePost)}>
        <input type="text" placeholder="name tag" {...register("nameTag")} />
        {errors.nameTag ? <p>{errors.nameTag.message}</p> : ""}
        <input type="text" placeholder="language" {...register("language")} />
        {errors.language ? <p>{errors.language.message}</p> : ""}
        <input type="text" placeholder="name" {...register("name")} />
        {errors.name ? <p>{errors.name.message}</p> : ""}
        <input type="text" {...register("description")} />
        {errors.description ? <p>{errors.description.message}</p> : ""}
        <input type="text" {...register("mediaUrl")} />
        {errors.mediaUrl ? <p>{errors.mediaUrl.message}</p> : ""}
        <button type="submit"></button>
      </form>
    </div>
  );
};
