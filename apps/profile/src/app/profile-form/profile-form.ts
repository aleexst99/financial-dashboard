import { Component, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileApiService } from '../services/profile-api.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm implements OnInit {
  private readonly profileApi = inject(ProfileApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly nameForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  protected readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly loadingProfile = signal(true);
  protected readonly savingName = signal(false);
  protected readonly savingPassword = signal(false);
  protected readonly nameSuccess = signal(false);
  protected readonly passwordSuccess = signal(false);
  protected readonly passwordError = signal<string | null>(null);

  ngOnInit(): void {
    this.profileApi.getProfile().subscribe({
      next: (profile) => {
        this.nameForm.patchValue({ name: profile.name });
        this.loadingProfile.set(false);
      },
      error: () => this.loadingProfile.set(false),
    });
  }

  saveName(): void {
    if (this.nameForm.invalid) {
      return;
    }

    this.savingName.set(true);
    this.nameSuccess.set(false);
    const name = this.nameForm.value.name as string;

    this.profileApi.updateProfile(name).subscribe({
      next: () => {
        this.savingName.set(false);
        this.nameSuccess.set(true);
      },
      error: () => this.savingName.set(false),
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.savingPassword.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set(null);

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.profileApi.changePassword(currentPassword as string, newPassword as string).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordSuccess.set(true);
        this.passwordForm.reset();
      },
      error: (err) => {
        this.savingPassword.set(false);
        this.passwordError.set(err.error?.message ?? 'Error al cambiar la contraseña');
      },
    });
  }
}