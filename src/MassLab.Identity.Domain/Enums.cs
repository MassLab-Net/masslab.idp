namespace MassLab.Identity.Domain;

public enum TenantStatus
{
    Active = 1,
    Disabled = 2
}

public enum ClientType
{
    Web = 1,
    Spa = 2,
    Mobile = 3,
    Service = 4
}

public enum AuditResult
{
    Success = 1,
    Failure = 2
}

public enum ActorType
{
    User = 1,
    TenantAdmin = 2,
    SystemAdmin = 3,
    Client = 4
}
