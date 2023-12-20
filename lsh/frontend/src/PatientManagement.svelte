<script>
    import {
    DataTable,
    Dropdown,
    DatePicker,
    DatePickerInput,
    InlineNotification,
    Modal,
    OverflowMenu,
    OverflowMenuItem,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Button,
    } from "carbon-components-svelte";
    let patients = String(window.fhir_patients);
    let patient_count = Number(window.fhir_patient_count)

    let headers = [];
    let rows = [];

    if (patients === '[]'){
    headers.push({ key: 'id', value: 'id'});
    headers.push({ key: 'name', value: 'e.g. name'});
    headers.push({ key: 'gender', value: 'e.g. gender'});
    headers.push({ key: 'birthDate', value: 'e.g. birthDate'});
    } else {
    patients = JSON.parse(patients);
    const cols = Object.keys(patients[0].resource).slice(1);

    cols.forEach(element => headers.push({ key: element.toLowerCase(), value: element }));

    patients.forEach(element => rows.push(
    { id: element.resource.id, name: element.resource.name[0].text, gender: element.resource.gender, birthdate: element.resource.birthDate }
    ));
    }
    headers.push({ key: "overflow", empty: true});

    let open = false;
    let successfulPatientCreation = false;
    let patientName = '';
    let gender = "0";
    let dob = '';
    let badData = false;
    let isPrimaryButtonClicked = false;
    let deletePatient = false;

    let gender_lut = [
    { id: "0", text: "Male" },
    { id: "1", text: "Female" },
    { id: "2", text: "Other" },
  ]

async function handleClose(event) {
        window.location.reload();
}

async function handlePatientCreate(event) {

      isPrimaryButtonClicked = true;
      badData = false;
      event.preventDefault();
      const formData = new FormData();

      if (patientName === '' || dob === ''){
        badData = true;
        return
      }

      if (patientName.includes('_')){
        badData = true;
        return
      }

      formData.append('operation', 'CREATE');
      formData.append('name', patientName);
      formData.append('gender', gender_lut[gender].text);
      formData.append('dob', dob);
      const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      try {
          const response = await fetch(window.location.href, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRFToken': csrfToken
          }
      });

      if (response.ok) {
        successfulPatientCreation = true;
//		alert('Patient created');
		} else {
			badData = true;
		}
      } catch (error) {
        badData = true;
      }
//      open = false;
}

async function viewResource(patientID){
    const operation = new FormData();
    operation.append('operation', 'VIEW');
    operation.append('id', patientID);
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      const response = await fetch(window.location.href, {
      method: 'POST',
      body: operation,
      headers: {
        'X-CSRFToken': csrfToken,
      }
      });
      if (response.ok) {
          alert('Yet to be implemented');
      }

      // console.log(response.headers.get('RetVal'))
}

async function handlePatientDelete(patientID, patientName){
      const deleteData = new FormData();
      deleteData.append('operation', 'DELETE')
      deleteData.append('id', patientID);
      deleteData.append('name', patientName);
      const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      try {
          const response = await fetch(window.location.href, {
          method: 'POST',
          body: deleteData,
          headers: {
            'X-CSRFToken': csrfToken,
          }
      });
      if (response.ok) {
		alert('Patient deleted');
        window.location.reload();
		} else {
		alert('Patient deletion failed');
        window.location.reload();
		}
      } catch (error) {
        alert('An error occured')
          window.location.reload();
      }

}

</script>

<main>
    <DataTable
    title="Patient management"
    sortable
    zebra
    stickHeader
    description="{patient_count} patient(s) found"
    {headers}
    {rows}>
      <svelte:fragment slot="cell" let:cell let:row>
        {#if cell.key === "overflow"}
          <OverflowMenu flipped>
            <OverflowMenuItem text="View resources" on:click={viewResource(row['id'])}/>
            <OverflowMenuItem danger text="Delete" on:click={handlePatientDelete(row['id'], row['name'])}/>
          </OverflowMenu>
        {:else}{cell.value}{/if}
      </svelte:fragment>

  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch/>
      <!---
      <ToolbarMenu>
        <ToolbarMenuItem primaryFocus>Restart all</ToolbarMenuItem>
        <ToolbarMenuItem href="https://cloud.ibm.com/docs/loadbalancer-service">
          API documentation
        </ToolbarMenuItem>
        <ToolbarMenuItem hasDivider danger>Stop all</ToolbarMenuItem>
      </ToolbarMenu>
      --->
    <Button on:click={() => (open = true)}>Create patient</Button>

    </ToolbarContent>
  </Toolbar>
</DataTable>

<Modal
  preventCloseOnClickOutside
  size="lg"
  bind:open
  modalHeading="Create patient resource"
  primaryButtonText="Confirm"
  secondaryButtonText="Close"
  primaryButtonDisabled={isPrimaryButtonClicked}
  on:click:button--secondary={() => (open = false, successfulPatientCreation = false)}
  on:open
  on:close={handleClose}
  on:submit={handlePatientCreate}
>
  <TextInput labelText="Patient name" placeholder="Enter name ..." bind:value={patientName}/>

  <Dropdown
  titleText="Gender"
  items={gender_lut}
  bind:selectedId={gender}
/>
<DatePicker dateFormat="d/m/Y" datePickerType="single" on:change bind:value={dob}>
  <DatePickerInput labelText="Date of birth" placeholder="dd/mm/yyyy"/>
</DatePicker>

{#if successfulPatientCreation}
   <InlineNotification
      lowContrast
      kind="success"
      title="Success:"
      subtitle="Patient creation successful. It might take some time for the changes to propagate. You may close this page"
      on:close={() => (successfulPatientCreation = false, badData = false)}

    />
{/if}

{#if badData}
   <InlineNotification
      lowContrast
      kind="error"
      title="Error:"
      subtitle="Invalid inputs or patient already exists"
      on:close={() => (successfulPatientCreation = false, badData = false)}
    />
{/if}
    <div class="spacer">

    </div>
</Modal>

</main>

<style>
/* Reset default styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


/* Style the main container */
main {
  margin: 0 auto;
  padding: 20px;
}

.spacer {
    padding: 15%;
}

</style>
