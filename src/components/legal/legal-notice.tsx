import { LEGAL, isSafeUrl, pendingLegalFields, type LegalConfig } from "@/config/legal";

/**
 * Data-protection line shared by the consent form and the sign-up form. Renders the controller details
 * from src/config/legal.ts, or an explicit "pending" note while they are not filled in.
 */
export function LegalNotice({ config = LEGAL }: { config?: LegalConfig }) {
  const pending = pendingLegalFields(config);
  const policyUrl = config.privacyPolicyUrl?.trim();
  const showPolicy = !!policyUrl && isSafeUrl(policyUrl);
  const external = showPolicy && !policyUrl.startsWith("/");

  return (
    <p className="text-sm">
      Tratamiento de datos personales conforme a la Ley 1581 de 2012 (Colombia).{" "}
      {pending.length === 0 ? (
        <>
          Responsable del tratamiento: {config.controllerName?.trim()}. Para ejercer tus derechos escribe a{" "}
          <a className="underline" href={`mailto:${config.controllerEmail?.trim()}`}>
            {config.controllerEmail?.trim()}
          </a>
          .{" "}
        </>
      ) : (
        <>Datos del responsable del tratamiento: pendientes de completar. </>
      )}
      {showPolicy ? (
        <>
          Consulta la{" "}
          <a
            className="underline"
            href={policyUrl}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { rel: "noopener" })}
          >
            política de privacidad
          </a>
          .{" "}
        </>
      ) : null}
      Versión de la política: {config.policyVersion}.
    </p>
  );
}
